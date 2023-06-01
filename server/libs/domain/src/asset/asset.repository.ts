import { AssetEntity, AssetType } from '@app/infra/entities';
import { Paginated, PaginationOptions } from '../domain.util';

export interface AssetSearchOptions {
  isVisible?: boolean;
  type?: AssetType;
}

export enum TimeBucketSize {
  DAY = 'DAY',
  MONTH = 'MONTH',
}

export interface TimeBucketOptions {
  size: TimeBucketSize;
  isArchived?: boolean;
  isFavorite?: boolean;
  albumId?: string;
}

export interface LivePhotoSearchOptions {
  ownerId: string;
  livePhotoCID: string;
  otherAssetId: string;
  type: AssetType;
}

export interface MapMarkerSearchOptions {
  isFavorite?: boolean;
}

export interface MapMarker {
  id: string;
  lat: number;
  lon: number;
}

export enum WithoutProperty {
  THUMBNAIL = 'thumbnail',
  ENCODED_VIDEO = 'encoded-video',
  EXIF = 'exif',
  CLIP_ENCODING = 'clip-embedding',
  OBJECT_TAGS = 'object-tags',
  FACES = 'faces',
}

export const IAssetRepository = 'IAssetRepository';

export interface TimeBucketItem {
  timeBucket: string;
  count: number;
}

export interface IAssetRepository {
  getByIds(ids: string[]): Promise<AssetEntity[]>;
  getWithout(pagination: PaginationOptions, property: WithoutProperty): Paginated<AssetEntity>;
  getFirstAssetForAlbumId(albumId: string): Promise<AssetEntity | null>;
  deleteAll(ownerId: string): Promise<void>;
  getAll(pagination: PaginationOptions, options?: AssetSearchOptions): Paginated<AssetEntity>;
  save(asset: Partial<AssetEntity>): Promise<AssetEntity>;
  findLivePhotoMatch(options: LivePhotoSearchOptions): Promise<AssetEntity | null>;
  getMapMarkers(ownerId: string, options?: MapMarkerSearchOptions): Promise<MapMarker[]>;
  getTimeBuckets(userId: string, options: TimeBucketOptions): Promise<TimeBucketItem[]>;
  getByTimeBucket(userId: string, timeBucket: string, options: TimeBucketOptions): Promise<AssetEntity[]>;
}
