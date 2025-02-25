import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:immich_mobile/shared/models/asset.dart';
import 'package:immich_mobile/shared/providers/db.provider.dart';
import 'package:isar/isar.dart';

final allVideoAssetsProvider = FutureProvider<List<Asset>>((ref) async {
  return ref
      .watch(dbProvider)
      .assets
      .filter()
      .typeEqualTo(AssetType.video)
      .findAll();
});
