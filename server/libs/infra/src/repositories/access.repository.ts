import { IAccessRepository } from '@app/domain';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity, AssetEntity, PartnerEntity, SharedLinkEntity } from '../entities';

export class AccessRepository implements IAccessRepository {
  constructor(
    @InjectRepository(AlbumEntity) private albumRepository: Repository<AlbumEntity>,
    @InjectRepository(AssetEntity) private assetRepository: Repository<AssetEntity>,
    @InjectRepository(PartnerEntity) private partnerRepository: Repository<PartnerEntity>,
    @InjectRepository(SharedLinkEntity) private sharedLinkRepository: Repository<SharedLinkEntity>,
  ) {}

  hasPartnerAccess(userId: string, partnerId: string): Promise<boolean> {
    return this.partnerRepository.exist({
      where: {
        sharedWithId: userId,
        sharedById: partnerId,
      },
    });
  }

  hasOwnerAssetAccess(userId: string, assetId: string): Promise<boolean> {
    return this.assetRepository.exist({
      where: {
        id: assetId,
        ownerId: userId,
      },
    });
  }

  hasPartnerAssetAccess(userId: string, assetId: string): Promise<boolean> {
    return this.partnerRepository.exist({
      where: {
        sharedWith: {
          id: userId,
        },
        sharedBy: {
          assets: {
            id: assetId,
          },
        },
      },
      relations: {
        sharedWith: true,
        sharedBy: {
          assets: true,
        },
      },
    });
  }

  async hasSharedLinkAssetAccess(id: string, assetId: string): Promise<boolean> {
    return (
      // album asset
      (await this.sharedLinkRepository.exist({
        where: {
          id,
          album: {
            assets: {
              id: assetId,
            },
          },
        },
      })) ||
      // individual asset
      (await this.sharedLinkRepository.exist({
        where: {
          id,
          assets: {
            id: assetId,
          },
        },
      }))
    );
  }

  hasAlbumAssetAccess(userId: string, assetId: string): Promise<boolean> {
    return this.albumRepository.exist({
      where: [
        {
          ownerId: userId,
          assets: {
            id: assetId,
          },
        },
        {
          sharedUsers: {
            id: userId,
          },
          assets: {
            id: assetId,
          },
        },
      ],
    });
  }
}
