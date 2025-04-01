import {isKomaUnpromoted, Koma, KomaType, promotePiece, unPromotePieceIfPossible} from '../interfaces/koma';
import {Tile} from '../interfaces/tile';
import {Move, MovementType, movementType} from '../interfaces/move';
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

  private canKomaBePromotedLegally(fromTile: Tile, toTile: Tile): boolean {
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
}
