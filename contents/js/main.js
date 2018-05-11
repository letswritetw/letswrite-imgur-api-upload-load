const s_public = {
  wave() {
    // nav
    const config = {
      duration: 300,
      delay: 400
    };
    Waves.init(config);
    Waves.attach('.js-nav-wave a', ['waves-light']);
  },
  socialLink() {
    if($('.js-social-share').length > 0) {
      const href = $('[rel="canonical"]').attr('href'),
            title = document.title;
      $('.js-line').attr('href', `https://line.naver.jp/R/msg/text/?${ title }%0D%0A${ href }`);
      $('.js-facebook').attr('href', `https://www.facebook.com/share.php?u=${ href }`);
      $('.js-google').attr('href', `https://plus.google.com/share?url=${ href }`);
      $('.js-twitter').attr('href', `https://twitter.com/share?text=${ title }&url=${ href }`);

      // when .js-open-social click, toggle .social-links
      $('.js-open-social').on('click', e => {
        e.preventDefault();
        $('.navbar, .toggle-share').toggleClass('active');
      });

      $('.js-trigger-burger').on('click', e => {
        $('.mobile-top').toggleClass('active');
      });
    }
  },
  gaViews() {
    var self = this;
    $.ajax({
      url: 'https://spreadsheets.google.com/feeds/list/1-kREAmeUN53MNmLe2B66mJBx2JtzLNR-jfINlU0jkkw/3/public/values?alt=json',
      dataType: 'json',
      crossDomain: true,
      success: function(data) {
        var d = data.feed.entry[0].gsx$pageviews.$t;
        $('.js-pageviews').text(d);
      }
    });
  },
  copyright() {
    $('.js-copyright .year').text(new Date().getFullYear() + ' Auguston All Rights Reserved.');
  }
};

$(function() {
  s_public.wave();
  s_public.socialLink();
  s_public.gaViews();
  s_public.copyright();
});
$(window).on({
  load() {
    PR.prettyPrint();
  }
});