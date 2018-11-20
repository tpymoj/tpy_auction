var list = [];

function updateList(index) {
  if (list.indexOf(index) > -1) {
    list.splice(list.indexOf(index), 1);
  } else {
    list.push(index);
  }
  refreshState();
}

function refreshState(){
  $('.gallery').find('.gallery--item--button__add-to-list').each(function(){
    if (list.indexOf($(this).attr('value')) > -1) {
      $(this).addClass('gallery--item--button__danger');
      $(this).text('從清單移除');
    } else {
      $(this).removeClass('gallery--item--button__danger');
      $(this).text('加入清單');
    }
  });
  $('.gallery').find('.gallery--item--label.gallery--item--label__primary').each(function(index){
    if (list.indexOf($(this).attr('value')) > -1) {
      $(this).addClass('gallery--item--label__primary__active');
    } else {
      $(this).removeClass('gallery--item--label__primary__active');
    }
  });

  var subtotal = 0;
  list.forEach(function(itemNumber){
    subtotal += parseInt(auction_items[itemNumber - 1].price.replace(/[^0-9.-]+/g,""));
  });
  var statusText = list.length > 0 ? '' + list.length + '件拍賣物 / 底價總和 $' + subtotal: '清單尚未加入任何拍賣物';
  $('#action-bar > .flex > span').text(statusText);
  if (list.length > 0) {
    $('#tips-bar').css('display', 'none');
  } else {
    if ($(window).width() <= 768) {
      $('#tips-bar').css('display', 'block');
    }
  }
}

switch(window.location.protocol) {
  // case 'http:':
  // case 'https:':
  //   //remote file over http or https
  //   break;
  case 'file:':
    //local file
    break;
  default: 
    var fontLink = jQuery('<link/>', {
      href: 'https://fonts.googleapis.com/css?family=Noto+Sans',
      rel: 'stylesheet',
    });
    fontLink.appendTo($('head'));
    break;
    //some other protocol
}

if (auction_items.length == 0) {
  $('#tips-bar').css('display', 'none');
  $('#action-bar').css('display', 'none');
  $('header').css('display', 'none');
  $('#empty-state-view').css('display', 'flex');
  $('.gallery').css('display', 'none');
} else {
  $('#tips-bar').css('display', 'block');
  $('#action-bar').css('display', 'block');
  $('header').css('display', 'block');
  $('#empty-state-view').css('display', 'none');
  $('.gallery').css('display', 'grid');
}

auction_items.forEach(function(item, index){
    var itemContainer = jQuery('<div/>', {
        class: 'gallery--item',
    });

    var itemInnerContainer = jQuery('<a/>', {
      class: 'gallery--item--container',
    });
    itemInnerContainer.attr('value', index + 1);
    itemContainer.attr('value', index + 1);
    itemContainer.hover(function(event){
      var galleryItem = $(event.currentTarget);
      galleryItem.find('.gallery--item--button').each(function(index){
        $(this).toggleClass('show');
      });
      galleryItem.find('.gallery--item--label').each(function(index){
        $(this).toggleClass('show');
      });
    });

    itemInnerContainer.click(function(){
      // check for non-hover enabled scenarios
      if ($(window).width() <= 768) {
        updateList($(this).attr('value'));
      }
    });

    var itemInfoContainer = jQuery('<div/>', {
        class: 'gallery--item--info-container',
    });

    var itemName = jQuery('<h2/>', {
        class: 'gallery--item--name',
    });
    itemName.text(item.item_name);

    var itemDescription = jQuery('<p/>', {
        class: 'gallery--item--description',
    });
    // itemDescription.text(item.item_description + ', ' + item.quantity + item.unit);
    itemDescription.text(item.quantity + item.unit);


    var itemImageContainer = jQuery('<div/>', {
        class: 'gallery--item--image-container',
    });

    var itemImage = jQuery('<img />', {
        class: 'gallery--item--image lazy',
    });

    itemImage.attr('data-src', 'img/' + item.item_number + '.JPG');

    var additionalMediaContainer = jQuery('<div/>', {
      class: 'hidden',
    });

    if (item.num_images > 1) {
      var i = 0;
      while (i < item.num_images - 1) {
        var imageMedia = jQuery('<a/>', {});
        imageMedia.attr('href', 'img/' + item.item_number + '-' + (i + 1) + '.JPG');
        imageMedia.attr('data-fancybox', index + 1);
        imageMedia.attr('data-caption', '#' + item.item_number + ' ' + item.item_name);
        imageMedia.appendTo(additionalMediaContainer);
        i++;
      }
    }

    if (item.num_videos > 0) {
      var i = 1;
      while (i <= item.num_videos) {
        var imageMedia = jQuery('<a/>', {});
        imageMedia.attr('href', 'videos/' + item.item_number + '-' + i + '.mp4');
        imageMedia.attr('data-fancybox', index + 1);
        imageMedia.attr('data-caption', '#' + item.item_number + ' ' + item.item_name);
        imageMedia.appendTo(additionalMediaContainer);
        i++;
      }
    }
    

    var itemLabelPrimary = jQuery('<label/>', {
        class: 'gallery--item--label gallery--item--label__primary',
    });
    itemLabelPrimary.attr('value', index + 1);
    itemLabelPrimary.text(parseInt(item.price) > 0 ? '底價 $' + item.price : '底價未定');

    var itemLabelSecondary = jQuery('<label/>', {
        class: 'gallery--item--label gallery--item--label__secondary',
    });
    itemLabelSecondary.text(item.item_number);

    var actionsContainer = jQuery('<div/>', {
      class: 'gallery--item--actions-container',
    });

    var itemViewImageButton = jQuery('<a/>', {
      class: 'gallery--item--button',
    });
    itemViewImageButton.attr('href', 'img/' + item.item_number + '.JPG');
    itemViewImageButton.attr('data-fancybox', index + 1);
    itemViewImageButton.attr('data-caption', '#' + item.item_number + ' ' + item.item_name);
    itemViewImageButton.text('看圖');

    var itemAddToListButton = jQuery('<button/>', {
      class: 'gallery--item--button gallery--item--button__add-to-list',
    });
    itemAddToListButton.attr('value', index + 1);
    itemAddToListButton.text('加入清單');
    itemAddToListButton.click(function(){
      var value = $(this).attr('value');
      updateList(value);
    });

    itemName.appendTo(itemInfoContainer);
    itemDescription.appendTo(itemInfoContainer);
    itemImage.appendTo(itemImageContainer);
    itemImageContainer.appendTo(itemInnerContainer);
    itemInfoContainer.appendTo(itemInnerContainer);
    itemLabelPrimary.appendTo(itemInnerContainer);
    itemLabelSecondary.appendTo(itemInnerContainer);
    itemViewImageButton.appendTo(actionsContainer)
    itemAddToListButton.appendTo(actionsContainer);
    actionsContainer.appendTo(itemInnerContainer);
    itemInnerContainer.appendTo(itemContainer);
    additionalMediaContainer.appendTo(itemContainer);
    itemContainer.appendTo($('.gallery'));
});

new ClipboardJS('#view-list', {
  text: function() {
    if (list.length > 0) {
      var subtotal = 0;
      list.forEach(function(itemNumber){
        subtotal += parseInt(auction_items[itemNumber - 1].price.replace(/[^0-9.-]+/g,""));
      });
      var alertText = '';
      list.forEach(function(itemNumber){
        var item = auction_items[itemNumber - 1]
        alertText += '#' + item.item_number + ' ' + item.item_name + '  $' + item.price + '\n';
      });
      alertText += '\n底價總合 $' + subtotal;
      alert('已將清單內容複製:\n\n' + alertText);
      return alertText;
    } else {
      alert('清單尚未加入任何拍賣物');
      return '';
    }
}});

var galleryStyle = jQuery('<style/>', {});
var isIE = /*@cc_on!@*/false || !!document.documentMode;

if (!isIE) {
  galleryStyle.html('.gallery { display: grid; grid-template-columns: repeat(auto-fill,minmax(320px, 1fr));}')
} else {
  galleryStyle.html('.gallery { display: flex; flex-wrap: wrap;}')
}

galleryStyle.appendTo($('body'));

$('document').ready(function(){
    var myLazyLoad = new LazyLoad({
        elements_selector: ".lazy"
    });

});