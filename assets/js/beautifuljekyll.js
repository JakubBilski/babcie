// Dean Attali / Beautiful Jekyll 2020

function showOnlyOne(prefix, maxId, showId) {
  for (step = 0; step < showId; step++) {
    $(`${prefix}${step+1}`).hide();
  }
  for (step = showId+1; step < maxId; step++) {
    $(`${prefix}${step+1}`).hide();
  }
  $(`${prefix}${showId+1}`).show();
}

var BeautifulJekyllJS = {

  bigImgEl : null,
  numImgs : null,

  init : function() {
    $(".navbar").addClass("top-nav-short");
    let numImages = 19;
    setTimeout(BeautifulJekyllJS.initNavbar, numImages);
    showOnlyOne("#image-1-", numImages, 5)
    let chosenImage1 = 0;
    let chosenImage2 = 0;
    $("#container-1").mousemove(function(event){
      newChosenImage = Math.floor(numImages*(event.pageX - $(this).offset().left) / $(this).width())
      if (newChosenImage > numImages-1) {
        newChosenImage = numImages-1;
      } else if(newChosenImage < 0) {
        newChosenImage = 0;
      }
      console.log(newChosenImage);
      console.log(chosenImage1);
      console.log(" ");
      if(newChosenImage != chosenImage1) {
        chosenImage1 = newChosenImage;
        showOnlyOne("#image-1-", numImages, chosenImage1);
      }
    });

    $("#container-2").mousemove(function(event){
      var border1 = $(this).offset().left + $(this).width()/4;
      var border2 = $(this).offset().left + $(this).width()/2;
      var border3 = $(this).offset().left + $(this).width()*3/4;
      if(event.pageX < border1) {
        if(chosenImage2 != 0) {
          chosenImage2 = 0;
          $("#image-2-middleleft").hide();
          $("#image-2-middleright").hide();
          $("#image-2-right").hide();
          $("#image-2-left").show();
        }
      }
      else if(event.pageX < border2) {
        if(chosenImage2 != 1) {
          chosenImage2 = 1;
          $("#image-2-left").hide();
          $("#image-2-middleright").hide();
          $("#image-2-right").hide();
          $("#image-2-middleleft").show();
        }
      }
      else if(event.pageX < border3) {
        if(chosenImage2 != 2) {
          chosenImage2 = 2;
          $("#image-2-left").hide();
          $("#image-2-middleleft").hide();
          $("#image-2-right").hide();
          $("#image-2-middleright").show();
        }
      }
      else {
        if(chosenImage2 != 3) {
          chosenImage2 = 3;
          $("#image-2-left").hide();
          $("#image-2-middleleft").hide();
          $("#image-2-middleright").hide();
          $("#image-2-right").show();
        }
      }
    });


    // On mobile, hide the avatar when expanding the navbar menu
    $('#main-navbar').on('show.bs.collapse', function () {
      $(".navbar").addClass("top-nav-expanded");
    });
    $('#main-navbar').on('hidden.bs.collapse', function () {
      $(".navbar").removeClass("top-nav-expanded");
    });

    // show the big header image
    BeautifulJekyllJS.initImgs();

    BeautifulJekyllJS.initSearch();
  },

  initNavbar : function() {
    // Set the navbar-dark/light class based on its background color
    const rgb = $('.navbar').css("background-color").replace(/[^\d,]/g,'').split(",");
    const brightness = Math.round(( // http://www.w3.org/TR/AERT#color-contrast
      parseInt(rgb[0]) * 299 +
      parseInt(rgb[1]) * 587 +
      parseInt(rgb[2]) * 114
    ) / 1000);
    if (brightness <= 125) {
      $(".navbar").removeClass("navbar-light").addClass("navbar-dark");
    } else {
      $(".navbar").removeClass("navbar-dark").addClass("navbar-light");
    }
  },

  initImgs : function() {
    // If the page was large images to randomly select from, choose an image
    if ($("#header-big-imgs").length > 0) {
      BeautifulJekyllJS.bigImgEl = $("#header-big-imgs");
      BeautifulJekyllJS.numImgs = BeautifulJekyllJS.bigImgEl.attr("data-num-img");

      // 2fc73a3a967e97599c9763d05e564189
      // set an initial image
      var imgInfo = BeautifulJekyllJS.getImgInfo();
      var src = imgInfo.src;
      var desc = imgInfo.desc;
      BeautifulJekyllJS.setImg(src, desc);

      // For better UX, prefetch the next image so that it will already be loaded when we want to show it
      var getNextImg = function() {
        var imgInfo = BeautifulJekyllJS.getImgInfo();
        var src = imgInfo.src;
        var desc = imgInfo.desc;

        var prefetchImg = new Image();
        prefetchImg.src = src;
        // if I want to do something once the image is ready: `prefetchImg.onload = function(){}`

        setTimeout(function(){
          var img = $("<div></div>").addClass("big-img-transition").css("background-image", 'url(' + src + ')');
          $(".intro-header.big-img").prepend(img);
          setTimeout(function(){ img.css("opacity", "1"); }, 50);

          // after the animation of fading in the new image is done, prefetch the next one
          //img.one("transitioned webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
          setTimeout(function() {
            BeautifulJekyllJS.setImg(src, desc);
            img.remove();
            getNextImg();
          }, 1000);
          //});
        }, 6000);
      };

      // If there are multiple images, cycle through them
      if (BeautifulJekyllJS.numImgs > 1) {
        getNextImg();
      }
    }
  },

  getImgInfo : function() {
    var randNum = Math.floor((Math.random() * BeautifulJekyllJS.numImgs) + 1);
    var src = BeautifulJekyllJS.bigImgEl.attr("data-img-src-" + randNum);
    var desc = BeautifulJekyllJS.bigImgEl.attr("data-img-desc-" + randNum);

    return {
      src : src,
      desc : desc
    }
  },

  setImg : function(src, desc) {
    $(".intro-header.big-img").css("background-image", 'url(' + src + ')');
    if (typeof desc !== typeof undefined && desc !== false) {
      $(".img-desc").text(desc).show();
    } else {
      $(".img-desc").hide();
    }
  },

  initSearch : function() {
    if (!document.getElementById("beautifuljekyll-search-overlay")) {
      return;
    }

    $("#nav-search-link").click(function(e) {
      e.preventDefault();
      $("#beautifuljekyll-search-overlay").show();
      $("#nav-search-input").focus().select();
      $("body").addClass("overflow-hidden");
    });
    $("#nav-search-exit").click(function(e) {
      e.preventDefault();
      $("#beautifuljekyll-search-overlay").hide();
      $("body").removeClass("overflow-hidden");
    });
    $(document).on('keyup', function(e) {
      if (e.key == "Escape") {
        $("#beautifuljekyll-search-overlay").hide();
        $("body").removeClass("overflow-hidden");
      }
    });
  }
};

// 2fc73a3a967e97599c9763d05e564189

document.addEventListener('DOMContentLoaded', BeautifulJekyllJS.init);
