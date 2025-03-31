import {isKomaUnpromoted, Koma, KomaType, promotePiece, unPromotePieceIfPossible} from '../interfaces/koma';
import {Tile} from '../interfaces/tile';
import {Move, movementType} from '../interfaces/move';
import {MovementService} from '../services/movement.service';

// should I make this a service to inject movementService ?
export class ShogiBoard {
  boardTiles: (Koma | undefined)[][] = [];
  senteKomas = new Map<KomaType, number>([]);
  goteKomas = new Map<KomaType, number>([]);
  movementService: MovementService;

  constructor(movementService: MovementService) {
    this.movementService = movementService;
    this.boardTiles = [[
      {kind: 'l', player: 'gote'}, {kind: 'n', player: 'gote'}, {kind: 's', player: 'gote'},
      {kind: 'G', player: 'gote'}, {kind: 'K', player: 'gote'}, {kind: 'G', player: 'gote'},
      {kind: 's', player: 'gote'}, {kind: 'n', player: 'gote'}, {kind: 'l', player: 'gote'}
    ],
      [
        undefined, {kind: 'r', player: 'gote'}, undefined, undefined, undefined, undefined, undefined,
        {kind: 'b', player: 'gote'}, undefined
      ],
      [
        {kind: 'p', player: 'gote'}, {kind: 'p', player: 'gote'}, {kind: 'p', player: 'gote'},
        {kind: 'p', player: 'gote'}, {kind: 'p', player: 'gote'}, {kind: 'p', player: 'gote'},
        {kind: 'p', player: 'gote'}, {kind: 'p', player: 'gote'}, {kind: 'p', player: 'gote'}
      ],
      // Empty rows
      [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],

      // sente
      [
        {kind: 'p', player: 'sente'}, {kind: 'p', player: 'sente'}, {kind: 'p', player: 'sente'},
        {kind: 'p', player: 'sente'}, {kind: 'p', player: 'sente'}, {kind: 'p', player: 'sente'},
        {kind: 'p', player: 'sente'}, {kind: 'p', player: 'sente'}, {kind: 'p', player: 'sente'}
      ],
      [
        undefined, {kind: 'b', player: 'sente'}, undefined, undefined, undefined, undefined, undefined,
        {kind: 'r', player: 'sente'}, undefined
      ],
      [
        {kind: 'l', player: 'sente'}, {kind: 'n', player: 'sente'}, {kind: 's', player: 'sente'},
        {kind: 'G', player: 'sente'}, {kind: 'K', player: 'sente'}, {kind: 'G', player: 'sente'},
        {kind: 's', player: 'sente'}, {kind: 'n', player: 'sente'}, {kind: 'l', player: 'sente'}
      ],
    ];
  }

  private increaseQuantityKoma(koma: Koma) {
    const komas = koma.player === "sente" ? this.senteKomas : this.goteKomas;
    const komaType = unPromotePieceIfPossible(koma.kind);
    const quantityInHand = (komas.get(komaType) || 0) + 1;
    komas.set(komaType, quantityInHand);
  }

  private decreaseQuantityKoma(koma: Koma) {
    const komas = koma.player === "sente" ? this.senteKomas : this.goteKomas;
    const komaType = unPromotePieceIfPossible(koma.kind);
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
    let promotion: '=' | "*" | undefined = this.canKomaBePromotedLegally(fromTile, toTile) ? '=' : undefined;
    let eatenKoma: KomaType | undefined = undefined;
    if (!fromTile.koma || fromTile === toTile) {
      return undefined;
    }
    if (toTile.koma) {
      moveType = "x";
      eatenKoma = toTile.koma.kind;
      this.increaseQuantityKoma(toTile.koma);
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
    this.decreaseQuantityKoma(koma);

    this.boardTiles[toTile.y][toTile.x] = {kind: koma.kind, player: koma.player};
    this.movementService.pushMovement({
      koma: koma.kind,
      movement: '*',
      destination: {x: toTile.x, y: toTile.y},
      player: koma.player
    });
  }

  canKomaBePromotedLegally(fromTile: Tile, toTile: Tile): boolean {
    console.log(fromTile);
    if (fromTile.koma && isKomaUnpromoted(fromTile.koma.kind)) {

      if (fromTile.koma.player === "sente" && (fromTile.y < 3) || (toTile.y < 3)) {
        return true;
      }
      if (fromTile.koma.player === "gote" && (fromTile.y > 5) || (toTile.y < 5)) {
        return true;
      }
    }
    return false;
  }

  promoteKoma(tile: Tile, move: Move): Move {
    if (tile.koma && isKomaUnpromoted(tile.koma.kind)) {
      this.boardTiles[tile.y][tile.x] = {kind: promotePiece(tile.koma.kind), player: tile.koma.player};
      move.promotion = '*';
    }
    return move;
  }


  public undoMove(move: Move) {
    const {movement, player, koma, origin, destination, promotion, eatenKoma} = move;

    // If move was a drop (*), remove piece from board and return it to player's pool
    if (movement === '*') {
      this.boardTiles[destination.y][destination.x] = undefined;
      this.increaseQuantityKoma({player, kind: koma});
      return;
    }

    // If move was a normal move (- or x)
    if (origin) {
      this.boardTiles[destination.y][destination.x] = undefined;

      // Restore the original koma, handling promotion rollback
      this.boardTiles[origin.y][origin.x] = {
        kind: promotion === '*' ? unPromotePieceIfPossible(koma) : koma,
        player,
      };

      // If a piece was captured (x), return it to the opponent's board
      if (movement === 'x' && eatenKoma) {
        this.decreaseQuantityKoma({player: player === "sente" ? "gote" : "sente", kind: eatenKoma});
        this.boardTiles[destination.y][destination.x] = {
          kind: eatenKoma,
          player: player === "sente" ? "gote" : "sente" // Ensure ownership is flipped
        };
      }
    }
    this.movementService.unpushMovement();

  }
}
