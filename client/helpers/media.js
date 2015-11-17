let Media = ReactionCore.Collections.Media;


ReactionCore.Media = {

  getProductMedia(aProduct, aVariant) {
    let mediaArray = [];
    let variant = aVariant || selectedVariant();
    let product = aProduct || selectedProduct();

    if (variant) {
      mediaArray = Media.find({
        "metadata.variantId": variant._id
      }, {
        sort: {
          "metadata.priority": 1
        }
      });
      if (!ReactionCore.hasAdminAccess() && mediaArray.count() < 1) {
        mediaArray = Media.find({
          "metadata.variantId": product.variants[0]._id
        }, {
          sort: {
            "metadata.priority": 1
          }
        });
      }
    } else {
      if (product) {
        let ids = [];
        for (variant of product.variants) {
          ids.push(variant._id);
        }
        mediaArray = Media.find({
          "metadata.variantId": {
            $in: ids
          }
        }, {
          sort: {
            "metadata.priority": 1
          }
        });
      }
    }
    return mediaArray.fetch();
  },

  productFileUpload(event) {
    let productId = selectedProductId();
    let variantId = selectedVariantId();
    let shopId = selectedProduct().shopId || ReactionCore.getShopId();
    let userId = Meteor.userId();
    let count = Media.find({
      "metadata.variantId": variantId
    }).count();

    return FS.Utility.eachFile(event, function (file) {
      let fileObj;
      fileObj = new FS.File(file);
      fileObj.metadata = {
        ownerId: userId,
        productId: productId,
        variantId: variantId,
        shopId: shopId,
        priority: count
      };
      Media.insert(fileObj);
      return count++;
    });
  }
};
