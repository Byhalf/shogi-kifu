import {
  INITIAL_BOARD,
  isKomaUnpromoted,
  Koma,
  KomaType,
  PlayerType,
  promotePiece,
  swapPlayer,
  unPromotePiece
} from '../../interfaces/koma';
import {Tile} from '../../interfaces/tile';
import {Move, MovementType, movementType} from '../../interfaces/move';
import {MovementService} from '../event-services/movement.service';
import {ShogiConverter} from './shogi-converter';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShogiBoard {
  boardTiles: (Koma | undefined)[][] = [];
  senteKomas = new Map<KomaType, number>([]);
  goteKomas = new Map<KomaType, number>([]);
  movementService: MovementService;
  private movesHistory: Move[] = [];


  constructor(movementService: MovementService) {
    this.movementService = movementService;
    this.boardTiles = INITIAL_BOARD.map(row =>
      row.map(cell => (cell ? {...cell} : undefined))
    );
    this.movementService.moveHistory$.subscribe(
      {
        next: moves => this.movesHistory = moves
      }
    )

  }

  private increaseQuantityKoma(koma: Koma) {
    const komas = koma.player === "sente" ? this.senteKomas : this.goteKomas;
    const komaType = unPromotePiece(koma.kind);
    const quantityInHand = (komas.get(komaType) || 0) + 1;
    komas.set(komaType, quantityInHand);
  }

  private decreaseQuantityKoma(koma: Koma) {
    const komas = koma.player === "sente" ? this.senteKomas : this.goteKomas;
    const komaType = unPromotePiece(koma.kind);
    let quantityInHand = komas.get(komaType);
    if (quantityInHand) {
      quantityInHand -= 1;
      if (quantityInHand === 0) {
        komas.delete(komaType);
        return;
      }
      komas.set(komaType, quantityInHand);
    }
  }

  moveKomaOnBoard(fromTile: Tile, toTile: Tile) {
    let moveType: movementType = '-';
    let promotion: '=' | "*" | undefined = this.isLegallyPromotable(fromTile, toTile) ? '=' : undefined;
    let eatenKoma: KomaType | undefined = undefined;
    if (!fromTile.koma || fromTile.koma.player === toTile.koma?.player) {
      return undefined;
    }
    if (!this.isPlayersTurn(fromTile.koma.player)) {
      return undefined;
    }
    if (toTile.koma) {
      moveType = "x";
      eatenKoma = toTile.koma.kind;
      this.increaseQuantityKoma(swapPlayer(toTile.koma));
    }
    let movement: Move = {
      koma: fromTile.koma.kind,
      origin: {x: fromTile.x, y: fromTile.y},
      movement: moveType,
      destination: {x: toTile.x, y: toTile.y},
      player: fromTile.koma.player,
      ...(eatenKoma !== undefined && {eatenKoma}),
      ...(promotion && {promotion})
    };


    this.boardTiles[toTile.y][toTile.x] = toTile.koma;
    this.boardTiles[fromTile.y][fromTile.x] = undefined;

    this.movementService.pushMovement(movement);
  }

  dropKomaFromHand(koma: Koma | undefined, toTile: Tile) {
    if (!koma || toTile.koma) {
      return;
    }
    if (!this.isPlayersTurn(koma.player)) {
      return undefined;
    }
    this.decreaseQuantityKoma(koma);
    console.log(toTile)
    console.log(toTile.y)

    this.boardTiles[toTile.y][toTile.x] = {kind: koma.kind, player: koma.player};
    this.movementService.pushMovement({
      koma: koma.kind,
      movement: '*',
      destination: {x: toTile.x, y: toTile.y},
      player: koma.player
    });
  }

  private isLegallyPromotable(fromTile: Tile, toTile: Tile): boolean {
    if (fromTile.koma && isKomaUnpromoted(fromTile.koma.kind)) {
      if (fromTile.koma.player === "gote" && (fromTile.y > 5 || toTile.y > 5)) {
        return true;
      }
      if (fromTile.koma.player === "sente" && (fromTile.y < 3 || toTile.y < 3)) {
        return true;
      }
    }
    return false;
  }

  promoteKoma(toTile: Tile): void {
    if (toTile.koma && isKomaUnpromoted(toTile.koma.kind)) {
      this.boardTiles[toTile.y][toTile.x] = {kind: promotePiece(toTile.koma.kind), player: toTile.koma.player};
      this.movementService.pushMovement({
        koma: toTile.koma.kind,
        movement: MovementType.PROMOTE,
        destination: {x: toTile.x, y: toTile.y},
        player: toTile.koma.player,
        promotion: "*"
      })
    }
  }

  private applyUndoMovement(move: Move): void {
    this.boardTiles[move.destination.x][move.destination.y] = undefined;
    if (!move.origin) {
      this.increaseQuantityKoma({player: move.player, kind: move.koma});
    } else {
      if (move.eatenKoma) {
        this.decreaseQuantityKoma({player: move.player, kind: move.eatenKoma})
        this.boardTiles[move.destination.x][move.destination.y] =
          {player: move.player === "sente" ? move.player : "gote", kind: move.eatenKoma};
      }
      this.boardTiles[move.origin.x][move.destination.y] = {
        player: move.player,
        kind: move.promotion === "*" ? unPromotePiece(move.koma) : move.koma
      };
    }


  }

  undoMovement(): void {
    if (this.movesHistory && this.movesHistory.length > 0) {
      let previousMove = this.movesHistory[this.movesHistory.length - 1];
      previousMove.movement = MovementType.UNDO;
      this.applyUndoMovement(previousMove);
      this.movementService.pushMovement(previousMove);

    }

  }


  exportGameToCsa(): string {
    return ShogiConverter.gameToCSA(INITIAL_BOARD, this.movesHistory);
  }

  private isPlayersTurn(player: PlayerType): boolean {
    if (!this.movesHistory || this.movesHistory.length === 0) {
      return true;
    }
    return this.movesHistory[this.movesHistory.length - 1].player !== player;

  }

}
