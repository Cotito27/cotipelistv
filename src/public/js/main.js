$(document).ready(function() {
  $('.genres__extend__button').on('click', function() {
    if($('.dropdown-content2').is(':visible')) {
      $('.dropdown-content2').toggle('show');
    }
    
    $('.year__extend__button').find('span').html(`<i class="fas fa-caret-right"></i>`);
    $('.dropdown-content').toggle('show');
    if($(this).html().includes('caret-right')) {
      $(this).find('span').html(`<i class="fas fa-caret-down"></i>`);
    } else {
      $(this).find('span').html(`<i class="fas fa-caret-right"></i>`);
    }
  });
  $('.year__extend__button').on('click', function() {
    if($('.dropdown-content').is(':visible')) {
      $('.dropdown-content').toggle('show');
    }
    $('.genres__extend__button').find('span').html(`<i class="fas fa-caret-right"></i>`);
    $('.dropdown-content2').toggle('show');
    if($(this).html().includes('caret-right')) {
      $(this).find('span').html(`<i class="fas fa-caret-down"></i>`);
    } else {
      $(this).find('span').html(`<i class="fas fa-caret-right"></i>`);
    }
  });
  function addPreLoadingImg() {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.25
    }
  
    let callback = (entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting && entry.target.className == 'image-loading') {
          let imageUrl = entry.target.dataset.src;
          if(imageUrl) {
            entry.target.src = imageUrl;
            entry.target.classList.remove('image-loading');
            entry.target.classList.add('image-loaded');
            observer.unobserve(entry.target);
            delete entry.target.dataset.src;
          }
        }
      });	
    }
  
    let observer = new IntersectionObserver(callback, options);
    let Imgs = document.querySelectorAll('.image-loading');
    Imgs.forEach((img) => {
      observer.observe(img);
    });
  }

  addPreLoadingImg();
  
  function isMobile(){
    return (
        (navigator.userAgent.match(/Android/i)) ||
        (navigator.userAgent.match(/webOS/i)) ||
        (navigator.userAgent.match(/iPhone/i)) ||
        (navigator.userAgent.match(/iPod/i)) ||
        (navigator.userAgent.match(/iPad/i)) ||
        (navigator.userAgent.match(/BlackBerry/i))
    );
  }

  let intervalOutMsg;
  function showInfoElement(text) {
    var x = document.querySelector(".content__info__element");
    let y = document.querySelector('.msg__info__element');
    y.textContent = text;
    y.classList.add("show_info_element");
    clearTimeout(intervalOutMsg);
    intervalOutMsg = setTimeout(function(){ 
      y.classList.remove("show_info_element");
     }, 3000);
  }

  
  /*Define some constants */
  const ARTICLE_TITLE =  document.title;
  const ARTICLE_URL = encodeURIComponent(window.location.href);
  const MAIN_IMAGE_URL = encodeURIComponent($('meta[property="og:image"]').attr('content'));

  $('.share-fb').click(function(){
    open_window('http://www.facebook.com/sharer/sharer.php?u='+ARTICLE_URL, 'facebook_share');
  });

  $('.share-twitter').click(function(){
    open_window('http://twitter.com/share?url='+ARTICLE_URL, 'twitter_share');
  });

  $('.share-google-plus').click(function(){
    open_window('https://plus.google.com/share?url='+ARTICLE_URL, 'google_share');
  });

  $('.share-linkedin').click(function(){
    open_window('https://www.linkedin.com/shareArticle?mini=true&url='+ARTICLE_URL+'&title='+ARTICLE_TITLE+'&summary=&source=', 'linkedin_share');
  });

  $('.share-pinterest').click(function(){
    open_window('https://pinterest.com/pin/create/button/?url='+ARTICLE_URL+'&media='+MAIN_IMAGE_URL+'&description='+ARTICLE_TITLE, 'pinterest_share');
  });

  $('.share-tumblr').click(function(){
    open_window('http://www.tumblr.com/share/link?url='+ARTICLE_URL+'&name='+ARTICLE_TITLE+'&description='+ARTICLE_TITLE, 'tumblr_share');
  });

  function open_window(url, name){
    var posicion_x; 
    var posicion_y; 
    let ancho = 650;
    let alto = 550;
    posicion_x=(screen.width/2)-(ancho/2); 
    posicion_y=(screen.height/2)-(alto/2); 
    window.open(url, name, "width="+ancho+",height="+alto+",menubar=0,toolbar=0,directories=0,scrollbars=no,resizable=no,left="+posicion_x+",top="+posicion_y+"");
  }

  if(location.href.includes('/my-list')) {
    $('body').on('mouseenter', '.carousel__elemento', function() {
      $('[data-tippy-root]').remove();
      $(this).append(`<div class="block__delete__list">
      <div class="delete__content">
        Quitar
      </div>
      <div class="play__video">
        <svg viewBox="0 0 100 100"><switch><g><path d="M84.2 43.6L24.4 3.8c-5.1-3.4-12 .3-12 6.4v79.5c0 6.2 6.9 9.8 12 6.4l59.8-39.8c4.5-2.9 4.5-9.7 0-12.7z"></path></g></switch></svg>
      </div>
    </div>`);
    });
    $('body').on('mouseleave', '.carousel__elemento', function() {
      $('[data-tippy-root]').remove();
      $(this).find('.block__delete__list').remove();
    });
  }

  $('body').on('click', '.delete__content', async function(e) {
      e.preventDefault();
      $('.loader__my__list').addClass('d-flex-show');
      let video_id = $(this).parent().parent().attr('data-video-id');
      let elementContainer = $(this).parent().parent();
      let user_id = $('#btnModalLogin').attr('data-user-id');
      let formData = new FormData();
      formData.set('video_id', video_id);
      formData.set('user_id', user_id);
      // console.log(video_id);
      let response = await fetch(`/deleteWatchList/`, {
        method: 'POST',
        body: formData
      });
     
      let res = await response.json();
      if(res.success) {
          elementContainer.remove();

          if($('.carousel__elemento').length < 1) {
            $('#pagination_container').remove();
            $('.content_img_videos').html(`<div class="not__found">No se encontraron resultados.</div>`);
          }
          socket.emit('deleteListWatch', { item: video_id });
          $('.loader__my__list').removeClass('d-flex-show');
        // $(this).html(`Agregar a mi lista`);
        // $(this).css('pointer-events', 'auto');
      } else {
        console.log('error');
        $('.loader__my__list').removeClass('d-flex-show');
      }
  });

  socket.on('getNewList', function(data) {
    $(`[data-video-id=${data.item}]`).remove();
    if($('.carousel__elemento').length < 1) {
      $('#pagination_container').remove();
      $('.content_img_videos').html(`<div class="not__found">No se encontraron resultados.</div>`);
    }
  });

  if(isMobile()) {
    let elementListSelected;
    $('body').on('contextmenu', '.carousel__elemento', function(e) {
      return false;
    });
    $('body').on('dragstart', 'img', function(event) {
       event.preventDefault(); 
    });
		let intervalAlert;
    function deleteInterval() {
      clearTimeout(intervalAlert);
    }
    $('body').on('touchstart', '.carousel__elemento', function(e) {
      // elementListSelected = $(this).attr('data-video-id');
      $('.carousel__active__element').removeClass('carousel__active__element');
      $(this).addClass('carousel__active__element');
      deleteInterval();
      intervalAlert = setTimeout(() => {
        showInfoElement(this.querySelector('.title-video').textContent);
      }, 500);
      // e.stopPropagation();
      // return e.preventDefault();
    });
    $('body').on('touchmove', '.carousel__elemento', function(e) {
      // $(this).addClass('carousel__active__element');
      deleteInterval();
      intervalAlert = setTimeout(() => {
        showInfoElement(this.querySelector('.title-video').textContent);
      }, 500);
      // e.stopPropagation();
      // return e.preventDefault();
    });
    $('body').on('touchend', '.carousel__elemento', function(e) {
      $(this).removeClass('carousel__active__element');
      deleteInterval();
      // e.stopPropagation();
      // return e.preventDefault();
    });
    $('body').on('touchcancel', '.carousel__elemento', function(e) {
      $(this).removeClass('carousel__active__element');
      deleteInterval();
      // e.stopPropagation();
      // return e.preventDefault();
    });
  }

  function addTooltip() {
    $('[data-tippy-root]').remove();
    if(!isMobile()) {
      tippy('.tooltip_auto', {
        placement: 'bottom',
        followCursor: true,
        distance: 10,
        allowHTML: true,
        animation: 'fade',
        theme: 'dark',
        delay: [650, 20],
        placement: "bottom",
        arrow: false,
        onShow(tip) {
          $('[data-tippy-root]').remove();
        },
        onHide(tip) {
          $('[data-tippy-root]').remove();
        }
      });
    } else {

    }
  }

  addTooltip();

  if(window.innerWidth <= 568) {
    $(document).on("click.sidebar",function(event) {
      var target = $(event.target);   
      // console.log($('.grab_audio').hasClass('d-none'));
      if(!$('.sidebar').hasClass('d-none')) {
        if (!target.closest(".sidebar").length && !target.closest(".menu__bars").length) {
          // closeMenu(function() {
          //     $(document).off("click.grab_audio");
          // });
          $('.sidebar').attr('style', 'display:none;');
          let blockContainer = document.querySelector('.block__container__sidebar');
          blockContainer.classList.add('d-none');
        }      
      }
    });
  }

  $('.menu__bars').on('click', function() {
  
    $('.sidebar').toggle('d-none');
    let container = document.querySelector('.container');
    container.classList.toggle('extend-block-left');
    if(window.innerWidth <= 568) {
      let blockContainer = document.querySelector('.block__container__sidebar');
      if(blockContainer.classList.contains('d-none')) {
        blockContainer.classList.remove('d-none');
      } else {
        blockContainer.classList.add('d-none');
      }
      
    }
    // $('.container').toggle('extend-block-left');
  });
  
  
  socket.on("getComment", function (data) {
    // updateTimeComments();
    if($('.not__found__comments')[0]) {
      // $('.section__comments').html(``);
      $('.not__found__comments').remove();
    }
    // if(!$('.comment__content__user')[0]) return;
    // console.log(data);
    let calcTime = timeago.format(data.timestamp, 'es');
    let myFoto = $('#btnModalLogin').attr('data-foto-user');
    $('.section__comments').prepend(`<div class="comment__total__user" data-id-comment="${data._id}">
    <div class="comment__original">
        <div class="comment__content__user">
          <div class="img__user__comment">
            <img src="${data.foto}" alt="">
          </div>
          <div class="user__comment">
            <div class="info__user__comment">
              <div class="nom__user">${data.name}</div>
              <div class="separating__info__date">•</div>
              <div class="date__comment" data-time-stamp="${data.timestamp}">${calcTime}</div>
            </div>
            <div class="comment__text">
              <div class="content__comment__user comment__text__user">${data.comment}</div>
            </div>
          </div>
        </div>
        <div class="actions__comment">
          <div class="like__action">
            <i class="far fa-thumbs-up"></i>
            <div class="number__likes__comment">${data.likes.length}</div>
          </div>
          <div class="dislike__action">
            <i class="far fa-thumbs-down"></i>
            <div class="number__dislikes__comment">${data.dislikes.length}</div>
          </div>
          <div class="reply__action">
            Responder
          </div>
        </div>
      </div>
    <div class="subcomment__original">
      
    </div>
    <div class="indicator__response__user">
      Respondiendo a <div class="nom__user__destino">${data.name}</div>
    </div>
    <div class="my__subcomment__content">
      <div class="my__img__subcomment">
        <img class="my__foto__subcomment" src="${myFoto}" alt="">
      </div>
      <div class="description__subcomment">
        <textarea
          class="input__subcomment"
          placeholder="Escribe un comentario"
        ></textarea>
        <div class="content__btn__subcomment">
          <button class="btn__send__subcomment">Comentar</button>
        </div>
      </div>
    </div>
  </div>`);
  
 
  });

  function updateTimeComments() {
    $('.date__comment,.date__subcomment').each(function() {
      let datePrev = $(this).attr('data-time-stamp');
      let calcTime = timeago.format(datePrev, 'es');
      $(this).text(calcTime);
    });
    
  }
  setInterval(function() {
    updateTimeComments();
    // console.log('Actualized');
  }, 60000);
  function verificarListWatch() {

  }

  $('body').on('click', '.save__lista__video', async function() {
    if(!$('[data-login-start]')[0]) {
      $('#modalLogin').attr('style', 'display:flex;');
      return;
    }
    $(this).css('pointer-events', 'none');
    $(this).html(`<div class="la-ball-clip-rotate la-light la-sm">
    <div></div>
  </div>`);
  // console.log($(this).html());
    // $('#modalWatchList').attr('style', 'display:flex;');
    if($(this).hasClass('lista__added')) {

      let video_id = _id_video;
      let title = titleVideoS;
      let image = imageVideoS;
      let year = yearVideoS;
      let score = scoreVideoS;
      let user_id = $('#btnModalLogin').attr('data-user-id');
      let formData = new FormData();
      formData.set('video_id', video_id);
      formData.set('user_id', user_id);
      formData.set('title', title);
      formData.set('image', image);
      formData.set('year', year);
      formData.set('score', score);
      let seasonsActive = false;
      if($('.season__part')[0]) {
        seasonsActive = true;
      }
      formData.set('seasons', seasonsActive);
      // console.log(video_id);
      let response = await fetch(`/saveWatchList/`, {
        method: 'POST',
        body: formData
      });
     
      let res = await response.json();
      if(res.success) {
        $(this).html(`Agregar a mi lista`);
        $(this).css('pointer-events', 'auto');
      }
    } else {
      let video_id = _id_video;
      let title = titleVideoS;
      let image = imageVideoS;
      let year = yearVideoS;
      let score = scoreVideoS;
      let user_id = $('#btnModalLogin').attr('data-user-id');
      let formData = new FormData();
      formData.set('video_id', video_id);
      formData.set('user_id', user_id);
      formData.set('title', title);
      formData.set('image', image);
      formData.set('year', year);
      formData.set('score', score);
      let seasonsActive = false;
      if($('.season__part')[0]) {
        seasonsActive = true;
      }
      formData.set('seasons', seasonsActive);
      // console.log(video_id);
      let response = await fetch(`/saveWatchList/`, {
        method: 'POST',
        body: formData
      });

      let res = await response.json();
      if(res.success) {
        $(this).html(`Agregado a mi lista`);
        $(this).css('pointer-events', 'auto');
      }
    }
    $(this).toggleClass('lista__added');
    
  });

  $('body').on('click', '.add__new__list', function() {
    $('#modalWatchList').find('.modal-content').html(`<span class="close">&times;</span>
    <div class="modal__header p-t-0">
      <div class="return__back__list">
        <i class="fas fa-arrow-left"></i>
      </div>
      <div class="title__form__list">
        Nueva Lista
      </div>
    </div>
    <div class="modal__body">
      <div class="form__list__watch">
        <div class="name__list">
          <label for="#nameList">Nombre</label>
          <input type="text" id="nameList" placeholder="Nueva Lista">
        </div>
        <div class="desc__list">
          <label for="#descList">Descripción</label>
          <textarea id="descList" placeholder="Alguna descripción"></textarea>
        </div>
        <button class="btnCreateList">Crear Lista</button>
      </div>
    </div>`);
  });

  $('body').on('click', '.return__back__list', function() {
    $('#modalWatchList').find('.modal-content').html(`<span class="close">&times;</span>
    <div class="modal__header">
      Agregar a:
    </div>
    <div class="modal__body">
      <div class="add__new__list">
        <svg viewBox="0 0 100 100"><path d="M50 23a4 4 0 00-4 4v19H27a4 4 0 100 8h19v19a4 4 0 108 0V54h19a4 4 0 100-8H54V27a4 4 0 00-4-4z" overflow="visible" color="#000" style="text-indent: 0px; text-transform: none;"></path></svg> Nueva Lista
      </div>
      <div class="list__watch">
        <svg viewBox="0 0 100 100"><path d="M50 23a4 4 0 00-4 4v19H27a4 4 0 100 8h19v19a4 4 0 108 0V54h19a4 4 0 100-8H54V27a4 4 0 00-4-4z" overflow="visible" color="#000" style="text-indent: 0px; text-transform: none;"></path></svg> Lista 1
      </div>
    </div>`);
  });

  async function getComments() {
    $('.section__comments').html(``);
    let id = _id_video;
    let user_id = $('#btnModalLogin').attr('data-user-id');
    let getcomments = await fetch(`/getComments/${id}`);
    let comments = await getcomments.json();
    let htmlSubComment = '';
    if(comments.comments.length <= 0) {
      $('.section__comments').html(`<div class="not__found__comments">No hay comentarios. Sé el primero en comentar</div>`);
      return;
    }
    comments.comments.forEach((comment, i) => {
    let calcTime = timeago.format(comment.timestamp, 'es');
    let myFoto = $('#btnModalLogin').attr('data-foto-user');
    $('.section__comments').append(`<div class="comment__total__user" data-id-comment="${comment._id}">
    <div class="comment__original">
      <div class="comment__content__user">
        <div class="img__user__comment">
          <img src="${comment.foto}" alt="">
        </div>
        <div class="user__comment">
          <div class="info__user__comment">
            <div class="nom__user">${comment.name}</div>
            <div class="separating__info__date">•</div>
            <div class="date__comment" data-time-stamp="${comment.timestamp}">${calcTime}</div>
          </div>
          <div class="comment__text">
            <div class="content__comment__user comment__text__user">${comment.comment}</div>
          </div>
        </div>
      </div>
      <div class="actions__comment">
        <div class="like__action">
          <i class="far fa-thumbs-up"></i>
          <div class="number__likes__comment">${comment.likes.length}</div>
        </div>
        <div class="dislike__action">
          <i class="far fa-thumbs-down"></i>
          <div class="number__dislikes__comment">${comment.dislikes.length}</div>
        </div>
        <div class="reply__action">
          Responder
        </div>
      </div>
    </div>
    <div class="subcomment__original">
      
    </div>
    <div class="indicator__response__user">
      Respondiendo a <div class="nom__user__destino">${comment.name}</div>
    </div>
    <div class="my__subcomment__content">
      <div class="my__img__subcomment">
        <img class="my__foto__subcomment" src="${myFoto}" alt="">
      </div>
      <div class="description__subcomment">
        <textarea
          class="input__subcomment"
          placeholder="Escribe un comentario"
        ></textarea>
        <div class="content__btn__subcomment">
          <button class="btn__send__subcomment">Comentar</button>
        </div>
      </div>
    </div>
  </div>`);
  if(user_id) {
    if(comment.likes.includes(user_id)) {
      $('.like__action').eq(i).find('i').replaceWith(`<i class="fas fa-thumbs-up"></i>`);
      $('.like__action').eq(i).addClass('reaction__comment__active');
    }
    if(comment.dislikes.includes(user_id)) {
      $('.dislike__action').eq(i).find('i').replaceWith(`<i class="fas fa-thumbs-down"></i>`);
      $('.dislike__action').eq(i).addClass('reaction__comment__active');
    }
  }
  htmlSubComment = '';
  comment.subcomments.forEach((item, indiceY) => {
    if(indiceY <= 7) {
      let calcTime = timeago.format(item.timestamp, 'es');
      $('.subcomment__original').eq(i).append( `
      <div class="content__subcomments__card" data-id-subcomment="${item.subId}">
      <div class="subcomment__content__user">
      <div class="img__user__subcomment">
        <img src="${item.foto}" alt="">
      </div>
      <div class="user__subcomment">
        <div class="info__user__subcomment">
          <div class="nom__user">${item.name}</div>
          <div class="separating__info__date">•</div>
          <div class="date__subcomment" data-time-stamp="${item.timestamp}">${calcTime}</div>
        </div>
        <div class="subcomment__text">
          <div class="content__subcomment__user comment__text__user"><a class="destino__comment">${item.destino}</a> ${item.comment}</div>
        </div>
      </div>
    </div>
    <div class="actions__subcomment">
      <div class="like__action__sub">
        <i class="far fa-thumbs-up"></i>
        <div class="number__likes__subcomment">${item.likes.length}</div>
      </div>
      <div class="dislike__action__sub">
        <i class="far fa-thumbs-down"></i>
        <div class="number__dislikes__subcomment">${item.dislikes.length}</div>
      </div>
      <div class="reply__action">
        Responder
      </div>
    </div>
      </div>`);
    } else {
      let calcTime = timeago.format(item.timestamp, 'es');
      $('.subcomment__original').eq(i).append(`
      <div class="content__subcomments__card d-none" data-id-subcomment="${item.subId}">
      <div class="subcomment__content__user">
      <div class="img__user__subcomment">
        <img src="${item.foto}" alt="">
      </div>
      <div class="user__subcomment">
        <div class="info__user__subcomment">
          <div class="nom__user">${item.name}</div>
          <div class="separating__info__date">•</div>
          <div class="date__subcomment" data-time-stamp="${item.timestamp}">${calcTime}</div>
        </div>
        <div class="subcomment__text">
          <div class="content__subcomment__user comment__text__user"><a class="destino__comment">${item.destino}</a> ${item.comment}</div>
        </div>
      </div>
    </div>
    <div class="actions__subcomment">
      <div class="like__action__sub">
        <i class="far fa-thumbs-up"></i>
        <div class="number__likes__subcomment">${item.likes.length}</div>
      </div>
      <div class="dislike__action__sub">
        <i class="far fa-thumbs-down"></i>
        <div class="number__dislikes__subcomment">${item.dislikes.length}</div>
      </div>
      <div class="reply__action">
        Responder
      </div>
    </div>
      </div>`);
    }
    if(user_id) {
      if(item.likes.includes(user_id)) {
        $('.comment__total__user').eq(i).find('.like__action__sub').eq(indiceY).find('i').replaceWith(`<i class="fas fa-thumbs-up"></i>`);
        $('.comment__total__user').eq(i).find('.like__action__sub').eq(indiceY).addClass('reaction__comment__active');
      }
      if(item.dislikes.includes(user_id)) {
        $('.comment__total__user').eq(i).find('.dislike__action__sub').eq(indiceY).find('i').replaceWith(`<i class="fas fa-thumbs-down"></i>`);
        $('.comment__total__user').eq(i).find('.dislike__action__sub').eq(indiceY).addClass('reaction__comment__active');
      }
    }
});
  // $('.subcomment__original').eq(i).html(htmlSubComment);
  if(comment.subcomments.length > 8) {
    $('.subcomment__original').eq(i).append(`<div class="not__found__subcomments">Ver más respuestas</div>`);
  }
    });
    if(comments.moreComments) {
      $('.section__comments').append(`<div class="more__comments" data-next-page="${comments.page}">Ver más comentarios</div>`);
    }
   
  // console.log(htmlSubComment);
  
  
  }

  $('body').on('click', '.more__comments', async function() {
    $('.more__comments').css('pointer-events', 'none');
    $('.more__comments').html(`<div class="la-ball-clip-rotate la-light la-sm">
    <div></div>
  </div>`);
    let numAdici = $('.comment__total__user').length;
    let id = _id_video;
    let user_id = $('#btnModalLogin').attr('data-user-id');
    let page = $(this).attr('data-next-page');
    let getcomments = await fetch(`/getComments/${id}?page=${parseInt(page) + 1}`);
    let comments = await getcomments.json();
    comments.comments.forEach((comment, i) => {
      let calcTime = timeago.format(comment.timestamp, 'es');
      let myFoto = $('#btnModalLogin').attr('data-foto-user');
      $('.section__comments').append(`<div class="comment__total__user" data-id-comment="${comment._id}">
      <div class="comment__original">
        <div class="comment__content__user">
          <div class="img__user__comment">
            <img src="${comment.foto}" alt="">
          </div>
          <div class="user__comment">
            <div class="info__user__comment">
              <div class="nom__user">${comment.name}</div>
              <div class="separating__info__date">•</div>
              <div class="date__comment" data-time-stamp="${comment.timestamp}">${calcTime}</div>
            </div>
            <div class="comment__text">
              <div class="content__comment__user comment__text__user">${comment.comment}</div>
            </div>
          </div>
        </div>
        <div class="actions__comment">
          <div class="like__action">
            <i class="far fa-thumbs-up"></i>
            <div class="number__likes__comment">${comment.likes.length}</div>
          </div>
          <div class="dislike__action">
            <i class="far fa-thumbs-down"></i>
            <div class="number__dislikes__comment">${comment.dislikes.length}</div>
          </div>
          <div class="reply__action">
            Responder
          </div>
        </div>
      </div>
      <div class="subcomment__original">
        
      </div>
      <div class="indicator__response__user">
        Respondiendo a <div class="nom__user__destino">${comment.name}</div>
      </div>
      <div class="my__subcomment__content">
        <div class="my__img__subcomment">
          <img class="my__foto__subcomment" src="${myFoto}" alt="">
        </div>
        <div class="description__subcomment">
          <textarea
            class="input__subcomment"
            placeholder="Escribe un comentario"
          ></textarea>
          <div class="content__btn__subcomment">
            <button class="btn__send__subcomment">Comentar</button>
          </div>
        </div>
      </div>
    </div>`);
    if(user_id) {
      if(comment.likes.includes(user_id)) {
        $('.like__action').eq(i + numAdici).find('i').replaceWith(`<i class="fas fa-thumbs-up"></i>`);
        $('.like__action').eq(i + numAdici).addClass('reaction__comment__active');
      }
      if(comment.dislikes.includes(user_id)) {
        $('.dislike__action').eq(i + numAdici).find('i').replaceWith(`<i class="fas fa-thumbs-down"></i>`);
        $('.dislike__action').eq(i + numAdici).addClass('reaction__comment__active');
      }
    }
    htmlSubComment = '';
    comment.subcomments.forEach((item, indiceY) => {
      if(indiceY <= 7) {
        let calcTime = timeago.format(item.timestamp, 'es');
        $('.subcomment__original').eq(i + numAdici).append(`
        <div class="content__subcomments__card" data-id-subcomment="${item.subId}">
        <div class="subcomment__content__user">
        <div class="img__user__subcomment">
          <img src="${item.foto}" alt="">
        </div>
        <div class="user__subcomment">
          <div class="info__user__subcomment">
            <div class="nom__user">${item.name}</div>
            <div class="separating__info__date">•</div>
            <div class="date__subcomment" data-time-stamp="${item.timestamp}">${calcTime}</div>
          </div>
          <div class="subcomment__text">
            <div class="content__subcomment__user comment__text__user"><a class="destino__comment">${item.destino}</a> ${item.comment}</div>
          </div>
        </div>
      </div>
      <div class="actions__subcomment">
        <div class="like__action__sub">
          <i class="far fa-thumbs-up"></i>
          <div class="number__likes__subcomment">${item.likes.length}</div>
        </div>
        <div class="dislike__action__sub">
          <i class="far fa-thumbs-down"></i>
          <div class="number__dislikes__subcomment">${item.dislikes.length}</div>
        </div>
        <div class="reply__action">
          Responder
        </div>
      </div>
        </div>`);
      } else {
        let calcTime = timeago.format(item.timestamp, 'es');
        $('.subcomment__original').eq(i + numAdici).append(`
        <div class="content__subcomments__card d-none" data-id-subcomment="${item.subId}">
        <div class="subcomment__content__user">
        <div class="img__user__subcomment">
          <img src="${item.foto}" alt="">
        </div>
        <div class="user__subcomment">
          <div class="info__user__subcomment">
            <div class="nom__user">${item.name}</div>
            <div class="separating__info__date">•</div>
            <div class="date__subcomment" data-time-stamp="${item.timestamp}">${calcTime}</div>
          </div>
          <div class="subcomment__text">
            <div class="content__subcomment__user comment__text__user"><a class="destino__comment">${item.destino}</a> ${item.comment}</div>
          </div>
        </div>
      </div>
      <div class="actions__subcomment">
        <div class="like__action__sub">
          <i class="far fa-thumbs-up"></i>
          <div class="number__likes__subcomment">${item.likes.length}</div>
        </div>
        <div class="dislike__action__sub">
          <i class="far fa-thumbs-down"></i>
          <div class="number__dislikes__subcomment">${item.dislikes.length}</div>
        </div>
        <div class="reply__action">
          Responder
        </div>
      </div>
        </div>`);
      }
      if(user_id) {
        if(item.likes.includes(user_id)) {
          $('.comment__total__user').eq(i + numAdici).find('.like__action__sub').eq(indiceY).find('i').replaceWith(`<i class="fas fa-thumbs-up"></i>`);
          $('.comment__total__user').eq(i + numAdici).find('.like__action__sub').eq(indiceY).addClass('reaction__comment__active');
        }
        if(item.dislikes.includes(user_id)) {
          $('.comment__total__user').eq(i + numAdici).find('.dislike__action__sub').eq(indiceY).find('i').replaceWith(`<i class="fas fa-thumbs-down"></i>`);
          $('.comment__total__user').eq(i + numAdici).find('.dislike__action__sub').eq(indiceY).addClass('reaction__comment__active');
        }
      }
  });
    

    // $('.subcomment__original').eq(i + numAdici).html(htmlSubComment);
    if(comment.subcomments.length > 8) {
      $('.subcomment__original').eq(i + numAdici).append(`<div class="not__found__subcomments">Ver más respuestas</div>`);
    }
      });
      $('.more__comments').remove();
      if(comments.moreComments) {
        $('.section__comments').append(`<div class="more__comments" data-next-page="${comments.page}">Ver más comentarios</div>`);
      } else {
        
      }
  });

  $('body').on('click', '.not__found__subcomments', function() {
    $(this).parent().find('.content__subcomments__card').removeClass('d-none');
    $(this).remove();
  });
  
  async function getLikesVideo() {
    let response = await fetch(`/getLikesVideo/${_id_video}`);
    let res = await response.json();
    let user_id = $('#btnModalLogin').attr('data-user-id');
    $('.number__likes__video').text(res.likes.length);
    $('.number__dislikes__video').text(res.dislikes.length);
    if(res.likes.includes(user_id)) {
      $('.like__video').find('i').replaceWith(`<i class="fas fa-thumbs-up"></i>`);
      $('.dislike__video').find('i').replaceWith(`<i class="far fa-thumbs-down"></i>`);
      $('.like__video').addClass('reaction__active__video');
    } 
    if(res.dislikes.includes(user_id)) {
      $('.dislike__video').find('i').replaceWith(`<i class="fas fa-thumbs-down"></i>`);
      $('.like__video').find('i').replaceWith(`<i class="far fa-thumbs-up"></i>`);
      $('.dislike__video').addClass('reaction__active__video');
    }
  }

  if($('.stream__video')[0]) {
    getLikesVideo();
    $('.section__comments').html(`<div class="la-ball-clip-rotate la-light la-sm">
    <div></div>
  </div>`);
    getComments();
  }
  
  socket.on('getLikes', (data) => {
    $(`[data-id-comment=${data.idComment}]`).find('.number__likes__comment').text(data.likes);
    $(`[data-id-comment=${data.idComment}]`).find('.number__dislikes__comment').text(data.dislikes);
  });

  socket.on('getsubLikes', (data) => {
    // console.log(data.dislikes);
    $(`[data-id-subcomment=${data.idSubComment}]`).find('.number__likes__subcomment').text(data.likes);
    $(`[data-id-subcomment=${data.idSubComment}]`).find('.number__dislikes__subcomment').text(data.dislikes);
  });

  $('body').on('click', '.like__action__sub', async function() {
    let idComment = $(this).parent().parent().parent().parent().attr('data-id-comment');
    let panelThis = $(this).parent().parent();
    let idSubComment = $(this).parent().parent().attr('data-id-subcomment');
    let idUser = $('#btnModalLogin').attr('data-user-id');
    if(!$('[data-login-start]')[0]) {
      $('#modalLogin').attr('style', 'display:flex;');
      return;
    }
    $(this).css('pointer-events', 'none');
    $(this).parent().find('.dislike__action').css('pointer-events', 'none');
    let response = await fetch(`/likeSubComment/${idComment}?subId=${idSubComment}&user_id=${idUser}`);
    let res = await response.json();
    if(res.likes) {
      socket.emit('sublikeUpdate', {
        idComment,
        idSubComment,
        likes: res.likes.length,
        dislikes: res.dislikes.length
      });
      if(res.focusLike) {
        $(this).find('i').replaceWith(`<i class="fas fa-thumbs-up"></i>`);
        $(this).parent().find('.dislike__action').find('i').replaceWith(`<i class="far fa-thumbs-down"></i>`);
        $(this).parent().find('.reaction__comment__active').removeClass('reaction__comment__active');
        $(this).addClass('reaction__comment__active');
      } else {
        $(this).find('i').replaceWith(`<i class="far fa-thumbs-up"></i>`);
        $(this).removeClass('reaction__comment__active');
      }
      panelThis.find('.number__likes__subcomment').text(res.likes.length);
      panelThis.find('.number__dislikes__subcomment').text(res.dislikes.length);
      $(this).css('pointer-events', 'auto');
      $(this).parent().find('.dislike__action').css('pointer-events', 'auto');
    } else {
      console.log('error');
    }
  });

  $('body').on('click', '.dislike__action__sub', async function() {
    let idComment = $(this).parent().parent().parent().parent().attr('data-id-comment');
    let panelThis = $(this).parent().parent();
    let idSubComment = $(this).parent().parent().attr('data-id-subcomment');
    let idUser = $('#btnModalLogin').attr('data-user-id');
    if(!$('[data-login-start]')[0]) {
      $('#modalLogin').attr('style', 'display:flex;');
      return;
    }
    $(this).css('pointer-events', 'none');
    $(this).parent().find('.like__action').css('pointer-events', 'none');
    let response = await fetch(`/dislikeSubComment/${idComment}?subId=${idSubComment}&user_id=${idUser}`);
    let res = await response.json();
    if(res.likes) {
      socket.emit('sublikeUpdate', {
        idComment,
        idSubComment,
        likes: res.likes.length,
        dislikes: res.dislikes.length
      });
      if(res.focusDislike) {
        $(this).find('i').replaceWith(`<i class="fas fa-thumbs-down"></i>`);
        $(this).parent().find('.like__action').find('i').replaceWith(`<i class="far fa-thumbs-up"></i>`);
        $(this).parent().find('.reaction__comment__active').removeClass('reaction__comment__active');
        $(this).addClass('reaction__comment__active');
      } else {
        $(this).find('i').replaceWith(`<i class="far fa-thumbs-down"></i>`);
        $(this).removeClass('reaction__comment__active');
      }
      panelThis.find('.number__likes__subcomment').text(res.likes.length);
      panelThis.find('.number__dislikes__subcomment').text(res.dislikes.length);
      $(this).css('pointer-events', 'auto');
      $(this).parent().find('.like__action').css('pointer-events', 'auto');
    } else {
      console.log('error');
    }
  });

  $('body').on('click', '.like__action', async function() {
    let idComment = $(this).parent().parent().parent().attr('data-id-comment');
    let idUser = $('#btnModalLogin').attr('data-user-id');
    if(!idUser) {
      $('#modalLogin').attr('style', 'display:flex;');
      return;
    }
    $(this).css('pointer-events', 'none');
    $(this).parent().find('.dislike__action').css('pointer-events', 'none');
    let response = await fetch(`/likeComment/${idComment}?user_id=${idUser}`);
    let res = await response.json();
    if(res.likes) {
      socket.emit('likeUpdate', {
        idComment,
        likes: res.likes.length,
        dislikes: res.dislikes.length
      });
      if(res.focusLike) {
        $(this).find('i').replaceWith(`<i class="fas fa-thumbs-up"></i>`);
        $(this).parent().find('.dislike__action').find('i').replaceWith(`<i class="far fa-thumbs-down"></i>`);
        $(this).parent().find('.reaction__comment__active').removeClass('reaction__comment__active');
        $(this).addClass('reaction__comment__active');
      } else {
        $(this).find('i').replaceWith(`<i class="far fa-thumbs-up"></i>`);
        $(this).removeClass('reaction__comment__active');
      }
      $(this).parent().find('.number__likes__comment').text(res.likes.length);
      $(this).parent().find('.number__dislikes__comment').text(res.dislikes.length);
      $(this).css('pointer-events', 'auto');
      $(this).parent().find('.dislike__action').css('pointer-events', 'auto');
    } else {
      console.log('error');
    }
  });

  $('body').on('click', '.dislike__action', async function() {
    let idComment = $(this).parent().parent().parent().attr('data-id-comment');
    let idUser = $('#btnModalLogin').attr('data-user-id');
    if(!$('[data-login-start]')[0]) {
      $('#modalLogin').attr('style', 'display:flex;');
      return;
    }
    $(this).css('pointer-events', 'none');
    $(this).parent().find('.like__action').css('pointer-events', 'none');
    let response = await fetch(`/dislikeComment/${idComment}?user_id=${idUser}`);
    let res = await response.json();
    if(res.dislikes) {
      socket.emit('likeUpdate', {
        idComment,
        likes: res.likes.length,
        dislikes: res.dislikes.length
      });
      if(res.focusDislike) {
        $(this).find('i').replaceWith(`<i class="fas fa-thumbs-down"></i>`);
        $(this).parent().find('.like__action').find('i').replaceWith(`<i class="far fa-thumbs-up"></i>`);
        $(this).parent().find('.reaction__comment__active').removeClass('reaction__comment__active');
        $(this).addClass('reaction__comment__active');
      } else {
        $(this).find('i').replaceWith(`<i class="far fa-thumbs-down"></i>`);
        $(this).removeClass('reaction__comment__active');
      }
      $(this).parent().find('.number__dislikes__comment').text(res.dislikes.length);
      $(this).parent().find('.number__likes__comment').text(res.likes.length);
      $(this).css('pointer-events', 'auto');
      $(this).parent().find('.like__action').css('pointer-events', 'auto');
    } else {
      console.log('error');
    }
  });

  $('body').on('click', '.like__video', async function() {
    if(!$('[data-login-start]')[0]) {
      $('#modalLogin').attr('style', 'display:flex;');
      return;
    }
    $(this).css('pointer-events', 'none');
    $('.dislike__video').css('pointer-events', 'none');
    let video_id = _id_video;
    let user_id = $('#btnModalLogin').attr('data-user-id');
    let response = await fetch(`/likeVideo/${video_id}?user_id=${user_id}`);
    let res = await response.json();
    if(res.likes) {
      socket.emit('likeVideoUpdate', {
        likes: res.likes.length,
        dislikes: res.dislikes.length
      });
      if(res.focusLike) {
        $(this).find('i').replaceWith(`<i class="fas fa-thumbs-up"></i>`);
        $('.dislike__video').find('i').replaceWith(`<i class="far fa-thumbs-down"></i>`);
        $('.reaction__active__video').removeClass('reaction__active__video');
        $(this).addClass('reaction__active__video');
      } else {
        $(this).find('i').replaceWith(`<i class="far fa-thumbs-up"></i>`);
        $(this).removeClass('reaction__active__video');
      }
      $(this).parent().find('.number__likes__video').text(res.likes.length);
      $(this).parent().find('.number__dislikes__video').text(res.dislikes.length);
      $(this).css('pointer-events', 'auto');
      $('.dislike__video').css('pointer-events', 'auto');
    } else {
      console.log('error');
    }
  });

  $('body').on('click', '.dislike__video', async function() {
    if(!$('[data-login-start]')[0]) {
      $('#modalLogin').attr('style', 'display:flex;');
      return;
    }
    $(this).css('pointer-events', 'none');
    $('.like__video').css('pointer-events', 'none');
    let video_id = _id_video;
    let user_id = $('#btnModalLogin').attr('data-user-id');
    let response = await fetch(`/dislikeVideo/${video_id}?user_id=${user_id}`);
    let res = await response.json();
    if(res.likes) {
      socket.emit('likeVideoUpdate', {
        likes: res.likes.length,
        dislikes: res.dislikes.length
      });
      if(res.focusDislike) {
        $(this).find('i').replaceWith(`<i class="fas fa-thumbs-down"></i>`);
        $('.like__video').find('i').replaceWith(`<i class="far fa-thumbs-up"></i>`);
        $('.reaction__active__video').removeClass('reaction__active__video');
        $(this).addClass('reaction__active__video');
      } else {
        $(this).find('i').replaceWith(`<i class="far fa-thumbs-down"></i>`);
        $(this).removeClass('reaction__active__video');
      }
      $(this).parent().find('.number__likes__video').text(res.likes.length);
      $(this).parent().find('.number__dislikes__video').text(res.dislikes.length);
      $(this).css('pointer-events', 'auto');
      $('.like__video').css('pointer-events', 'auto');
    } else {
      console.log('error');
    }
  });

  socket.on('getLikesVideo', (data) => {
    $(`.number__likes__video`).text(data.likes);
    $(`.number__dislikes__video`).text(data.dislikes);
  });

  $('body').on('click', '.btn__send__subcomment', function() {
    let valueComment = $(this).parent().parent().find('.input__subcomment').val();
    if(valueComment == '') {
      errorCommentFunction('Error!, El campo de comentario no puede estar vacio.');
      return;
    }
    if(valueComment.length < 5) {
      errorCommentFunction('Error!, El comentario debe contener al menos 5 caracteres.');
      return;
    }
    let id = $(this).parent().parent().parent().parent().attr('data-id-comment');
    let destino = $(this).parent().parent().parent().parent().find('.nom__user__destino').text();
    let name = $('#btnModalLogin').attr('data-name-user');
    let foto = $('#btnModalLogin').attr('data-foto-user');
    socket.emit('subComments', {
      id,
      name,
      comment: valueComment,
      foto,
      timestamp: new Date(),
      likes: [],
      dislikes: [],
      destino
    });
    $(this).parent().parent().find('.input__subcomment').val('');
  });

  socket.on('getSubComments', (item) => {
    // updateTimeComments();
    let calcTime = timeago.format(item.timestamp, 'es');
    $(`[data-id-comment=${item.id}]`).find('.subcomment__original').append(`
    <div class="content__subcomments__card" data-id-subcomment="${item.subId}">
    <div class="subcomment__content__user">
    <div class="img__user__subcomment">
      <img src="${item.foto}" alt="">
    </div>
    <div class="user__subcomment">
      <div class="info__user__subcomment">
        <div class="nom__user">${item.name}</div>
        <div class="separating__info__date">•</div>
        <div class="date__subcomment" data-time-stamp="${item.timestamp}">${calcTime}</div>
      </div>
      <div class="subcomment__text">
        <div class="content__subcomment__user comment__text__user"><a class="destino__comment">${item.destino}</a> ${item.comment}</div>
      </div>
    </div>
  </div>
  <div class="actions__subcomment">
    <div class="like__action__sub">
      <i class="far fa-thumbs-up"></i>
      <div class="number__likes__subcomment">${item.likes.length}</div>
    </div>
    <div class="dislike__action__sub">
      <i class="far fa-thumbs-down"></i>
      <div class="number__dislikes__subcomment">${item.dislikes.length}</div>
    </div>
    <div class="reply__action">
      Responder
    </div>
  </div>
  </div>`);
    // console.log(item);
  });

  $('body').on('click', '.reply__action', function() {
    if(!$('#btnModalLogin').attr('data-login-start')) {
      $('#modalLogin').attr('style', 'display:flex;');
      return;
    }
    let nameFocus = $(this).parent().parent().find('.nom__user').text();
    // console.log(nameFocus);
    $(this).parent().parent().parent().parent().find('.nom__user__destino').text(nameFocus);
    
    let verifyActiveThis = false;
    if($(this).hasClass('active__reply')) {
      verifyActiveThis = true;
    } 
    let cardFixedInput;
    if($(this).parent().parent().parent().hasClass('subcomment__original')) {
      cardFixedInput = $(this).parent().parent().parent().parent();
    } else {
      cardFixedInput = $(this).parent().parent().parent();
    }
    cardFixedInput.find('.active__reply').removeClass('active__reply');
    
    if(verifyActiveThis) {
      $(this).removeClass('active__reply');
      cardFixedInput.find('.indicator__response__user').removeClass('d-flex-show');
      cardFixedInput.find('.my__subcomment__content').removeClass('d-flex-show');
    } else {
      $(this).addClass('active__reply');
      cardFixedInput.find('.indicator__response__user').addClass('d-flex-show');
      cardFixedInput.find('.my__subcomment__content').addClass('d-flex-show');
    }
    cardFixedInput.find('.input__subcomment').focus();
  });

  $('.btn__send__comment').on('click', function() {
    if(!$('[data-login-start]')[0]) {
      $('#modalLogin').attr('style', 'display:flex;');
      return;
    }
    if($('.input__comment').val() == '') {
      errorCommentFunction('Error!, El campo de comentario no debe estar vacio.');
      return;
    }
    if($('.input__comment').val().length < 5) {
      errorCommentFunction('Error!, El comentario debe contener al menos 5 caracteres.');
      return;
    }
    // if(!$('.comment__content__user')[0]) return;
      // console.log(_id_video);
      let valComment = $('.input__comment').val();
      let userName = $('#btnModalLogin').attr('data-name-user');
      let userFoto = $('#btnModalLogin').attr('data-foto-user');
      let dateActual = new Date();

      socket.emit('sendComment', {
        video_id: _id_video,
        name: userName,
        foto: userFoto,
        comment: valComment
      });
      $('.input__comment').val('');
    
  });

  

  $('.tab_peli').on('click', function() {
    $('.peliculas__content').removeClass('d-none');
    $('.series__content').addClass('d-none');
  });

  let verifyLoadedSerie = false;
  $('.tab_serie').on('click', async function() {
    if(verifyLoadedSerie) {
      $('.peliculas__content').addClass('d-none');
      $('.series__content').removeClass('d-none');
    }
    if(!$(this).hasClass('active') && !verifyLoadedSerie) {
      
      $('.peliculas__content').addClass('d-none');
      $('.series__content').removeClass('d-none');
      $('.series__content').html(`<div class="la-ball-clip-rotate la-light la-sm">
      <div></div>
  </div>`);
      let response = await fetch('/getSerie');
      let res = await response.json();
      let newHTML = '';
      res.forEach((v) => {
        newHTML += `<a href="/${'serie'}/${v._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
        <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
        <p class="title-video">${v.title} (${v.year})</p>
        <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
      </a>`;
      });
      $('.series__content').html(newHTML);
      addPreLoadingImg();
      addTooltip();
      verifyLoadedSerie = true;
    }
  });

  $('.tablinks').on('click', toggleTabLink);

  function toggleTabLink(evt) {
    if(!evt.currentTarget.classList.contains('option__available')) {
      if(evt.currentTarget.classList.contains('season__part')) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active__temp", "");
        }
        evt.currentTarget.className += " active__temp";
      } else {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        evt.currentTarget.className += " active";
      }
      
    } else {
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active__stream", "");
      }
      // document.getElementById(cityName).style.display = "block";
      evt.currentTarget.className += " active__stream";
    }
    
  }

  // setTimeout(function() {
    
  // },500);
  
  // window.onresize = function() {
  //   if(window.innerWidth <= 622) {
  //     resizeElementCard();
  //   } else {
  //     $('.content_img_videos .carousel__elemento .title-video').each(function() {
  //       $(this).removeAttr('style');
  //     });
  //   }
  // }

  
  function resizeElementCard() {
    let vecHeightText = [];
      $('.content_img_videos .carousel__elemento .title-video').each(function() {
        vecHeightText.push($(this).height());
        // console.log($(this).height());
      });
      // console.log($('.content_img_videos .carousel__elemento').length);
      let maxHeightText = Math.max(...vecHeightText);
      $('.content_img_videos .carousel__elemento .title-video').each(function() {
        $(this).attr('style', `min-height: ${maxHeightText}px !important;`);
      });
  }
  
  // console.log(maxHeightEl, vecHeightElement);
  
  $('.btnMoreVideos').on('click', function() {
    location.href = `/${$('button.active').text().toLowerCase()}`;
  });
  if($('#stream__media')[0]) {
    if($('#stream__media').attr('src').includes('pelisplushd.me')) {
      // $('.play__stream__plusto').removeClass('d-none');
    } else {
      // $('.play__stream__plusto').addClass('d-none');
    }
  }
  $('.option__available').on('click', function(e) {
    $('.block__loading__stream').addClass('show');
    $('.preloading__stream').removeClass('d-none');
    $('#stream__media').attr('src', this.dataset.targetVideo);
    
  });

  function popup(url,ancho,alto) {
    var posicion_x; 
    var posicion_y; 
    posicion_x=(screen.width/2)-(ancho/2); 
    posicion_y=(screen.height/2)-(alto/2); 
    window.open(url, url, "width="+ancho+",height="+alto+",menubar=0,toolbar=0,directories=0,scrollbars=no,resizable=no,left="+posicion_x+",top="+posicion_y+"");
    }
    
  $('.play__stream__plusto a').on('click', function(e) {
    e.preventDefault();
    window.open(this.href, '_blank')
  });

  $('.preloading__stream').addClass('d-none');
  $('.block__loading__stream').removeClass('show');

  $('#stream__media').on('load', function() {
    $('.preloading__stream').addClass('d-none');
    $('.block__loading__stream').removeClass('show');
    if($(this).attr('src').includes('pelisplushd.me')) {
      // $('.play__stream__plusto').removeClass('d-none');
    } else {
      // $('.play__stream__plusto').addClass('d-none');
    }
  });

  $('#stream__media').on('click', function() {
  
  });

  $('.season__part').on('click', function() {
    $('.d-flex-show').removeClass('d-flex-show');
    $(`[data-target-temp=${$(this).attr('id')}]`).addClass('d-flex-show');
  });

  $('.search__icon').on('click', async function() {
    if($('.input__search').val() == '') {
      if(confirm('¿Está seguro de buscar todas las peliculas y series?, esto podria tardar un poco.')) {

      } else {
        return;
      }
    }
      $('.search__icon').css('pointer-events', 'none');
      let titleVideo = $('.input__search').val();
        $('.search__icon').html(`<div class="la-ball-clip-rotate la-light la-sm">
        <div></div>
    </div>`);
        let response = await fetch(`/searchVideo/${titleVideo}`);
        let res = await response.json();
        let currentPage = res.page;
        history.pushState(null, "", `/search/${titleVideo}?page=${currentPage || 1}`);
        let page = currentPage || 1;
        let newHTML = `<div class="container container_home animate__animated animate__fadeIn">
        <div class="content_last_videos">
          <h3 class="title_videos_last">Estas buscando: ${titleVideo} pagina ${page} latino HD</h3>
          <div class="content_img_videos">
                     
          </div>
        </div>
          <div id="pagination_container"></div>
          <div id="data_container"></div>
      </div>`;
      $('.container').replaceWith(newHTML);
      let htmlVideos = '';
      res.movies.forEach((item) => {
        if(item.type == 'Pelicula') {
          htmlVideos += `<a href="/pelicula/${item._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${item.title} (${item.year})">
          <div class="type__video__indicator__peli">Película</div>
          <img class="image-loaded" src="${item.image}" alt="">
          <p class="title-video">${item.title} (${item.year})</p>
          <div class="rating icon-star">
            <i class="fas fa-star" aria-hidden="true"></i>
            <label class="score">${item.score}</label>
          </div>
        </a> `;
        } else {
          htmlVideos += `<a href="/serie/${item._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${item.title} (${item.year})">
          <div class="type__video__indicator__serie">Serie</div>
        <img class="image-loaded" src="${item.image}" alt="">
        <p class="title-video">${item.title} (${item.year})</p>
        <div class="rating icon-star">
          <i class="fas fa-star" aria-hidden="true"></i>
          <label class="score">${item.score}</label>
        </div>
      </a> `;
        }
        
      })
      
      $('.content_img_videos').html(htmlVideos);
      let numVeriPages = 0;
      if(res.pages == 0) {
        $('.content_img_videos').html(`<div class="not__found">No se encontraron resultados.</div>`);
        $('.search__icon').html(`<i class="fas fa-search"></i>`);  
      $('.search__icon').css('pointer-events', 'auto');
        return;
      }
      $('#pagination_container').twbsPagination({
        totalPages: res.pages,
        visiblePages: 4,
        startPage: parseInt(currentPage),
        prev: '<span aria-hidden="true">&laquo;</span>',
        next: '<span aria-hidden="true">&raquo;</span>',
        onPageClick: async function (event, page) {
          numVeriPages ++;
    
          
          if(numVeriPages > 1) {
            $('.content_img_videos').html(`<div class="preloading__items__video"><div class="la-ball-clip-rotate la-light la-sm">
              <div></div>
          </div></div>`);
              history.pushState(null, "", `/search/${titleVideo}?page=${page}`);
              let response = await fetch(`/searchVideo/${titleVideo}?page=${page}`);
              let res = await response.json();
              let newHTML = '';
              res.movies.forEach((v) => {
                if(v.type == 'Pelicula') {
                  newHTML += `<a href="/${'pelicula'}/${v._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
                  <div class="type__video__indicator__peli">Película</div>
                  <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
                  <p class="title-video">${v.title} (${v.year})</p>
                  <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
                </a>`;
                } else {
                  newHTML += `<a href="/${'serie'}/${v._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
                  <div class="type__video__indicator__serie">Serie</div>
                <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
                <p class="title-video">${v.title} (${v.year})</p>
                <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
              </a>`;
                }
                
              });
              $('.content_img_videos').html(newHTML);
              $('.title_videos_last').html(`Estas buscando: ${titleVideo} pagina ${page} latino HD`);
              addPreLoadingImg();
              addTooltip();
              // 
            window.scroll({
              top: 0,
              behavior: 'smooth'
            });
          }       
        }
    });
    $('.search__icon').html(`<i class="fas fa-search"></i>`);
  $('.search__icon').css('pointer-events', 'auto');
    
  });
  $('.input__search').on('keyup', async function(e) {
    if(e.keyCode == 13) {
      e.preventDefault();
      if($(this).val() == '') {
        if(confirm('¿Está seguro de buscar todas las peliculas y series?, esto podria tardar un poco.')) {

        } else {
          return;
        }
      }
        let titleVideo = $(this).val();
        $('.search__icon').css('pointer-events', 'none');
        $('.search__icon').html(`<div class="la-ball-clip-rotate la-light la-sm">
        <div></div>
    </div>`);
        let response = await fetch(`/searchVideo/${titleVideo}`);
        let res = await response.json();
        let currentPage = res.page;
        history.pushState(null, "", `/search/${titleVideo}?page=${currentPage || 1}`);
        let page = currentPage || 1;
        let newHTML = `<div class="container container_home animate__animated animate__fadeIn">
        <div class="content_last_videos">
          <h3 class="title_videos_last">Estas buscando: ${titleVideo} pagina ${page} latino HD</h3>
          <div class="content_img_videos">
                     
          </div>
        </div>
          <div id="pagination_container"></div>
          <div id="data_container"></div>
      </div>`;
      $('.container').replaceWith(newHTML);
      let htmlVideos = '';
      res.movies.forEach((item) => {
        if(item.type == 'Pelicula') {
          htmlVideos += `<a href="/pelicula/${item._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${item.title} (${item.year})">
          <div class="type__video__indicator__peli">Película</div>
          <img class="image-loaded" src="${item.image}" alt="">
          <p class="title-video">${item.title} (${item.year})</p>
          <div class="rating icon-star">
            <i class="fas fa-star" aria-hidden="true"></i>
            <label class="score">${item.score}</label>
          </div>
        </a> `;
        } else {
          htmlVideos += `<a href="/serie/${item._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${item.title} (${item.year})">
          <div class="type__video__indicator__serie">Serie</div>
        <img class="image-loaded" src="${item.image}" alt="">
        <p class="title-video">${item.title} (${item.year})</p>
        <div class="rating icon-star">
          <i class="fas fa-star" aria-hidden="true"></i>
          <label class="score">${item.score}</label>
        </div>
      </a> `;
        }
        
      })
      
      $('.content_img_videos').html(htmlVideos);
      let numVeriPages = 0;
      if(res.pages == 0) {
        $('.content_img_videos').html(`<div class="not__found">No se encontraron resultados.</div>`);
        $('.search__icon').html(`<i class="fas fa-search"></i>`);  
      $('.search__icon').css('pointer-events', 'auto');
        return;
      }
      $('#pagination_container').twbsPagination({
        totalPages: res.pages,
        visiblePages: 4,
        startPage: parseInt(currentPage),
        prev: '<span aria-hidden="true">&laquo;</span>',
        next: '<span aria-hidden="true">&raquo;</span>',
        onPageClick: async function (event, page) {
          numVeriPages ++;
    
          
          if(numVeriPages > 1) {
            $('.content_img_videos').html(`<div class="preloading__items__video"><div class="la-ball-clip-rotate la-light la-sm">
              <div></div>
          </div></div>`);
              history.pushState(null, "", `/search/${titleVideo}?page=${page}`);
              let response = await fetch(`/searchVideo/${titleVideo}?page=${page}`);
              let res = await response.json();
              let newHTML = '';
              res.movies.forEach((v) => {
                if(v.type == 'Pelicula') {
                  newHTML += `<a href="/${'pelicula'}/${v._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
                  <div class="type__video__indicator__peli">Película</div>
                  <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
                  <p class="title-video">${v.title} (${v.year})</p>
                  <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
                </a>`;
                } else {
                  newHTML += `<a href="/${'serie'}/${v._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
                  <div class="type__video__indicator__serie">Serie</div>
                <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
                <p class="title-video">${v.title} (${v.year})</p>
                <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
              </a>`;
                }
                
              });
              $('.content_img_videos').html(newHTML);
              $('.title_videos_last').html(`Estas buscando: ${titleVideo} pagina ${page} latino HD`);
              addPreLoadingImg();
              addTooltip();
              // 
            window.scroll({
              top: 0,
              behavior: 'smooth'
            });
          }       
        }
    });
    $('.search__icon').html(`<i class="fas fa-search"></i>`);
  $('.search__icon').css('pointer-events', 'auto');
      }
    
    
   
  });

  function showRegisterForm() {
    $('#formLogin').get(0).reset();
    $('.error__pass').removeClass('show');
    $('.invalid__input').removeClass('invalid__input');
    $('.form__login').hide();
    $('.form__login__register').show();
    $('.login-footer').hide();
    $('.register-footer').show();
  }

  function showLoginForm() {
    $('#formRegister').get(0).reset();
    $('.error__pass').removeClass('show');
    $('.invalid__input').removeClass('invalid__input');
    $('.form__login').show();
    $('.form__login__register').hide();
    $('.login-footer').show();
    $('.register-footer').hide();
  }
  let intervalOut;
  function errorCommentFunction(text) {
    var x = document.getElementById("snackbar");
    x.textContent = text;
    x.className = "show";
    clearTimeout(intervalOut);
    intervalOut = setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);
  }
  $('#snackbar').click(function() {
    $(this).removeClass('show');
  });
  // errorCommentFunction();
  $('.show__register').on('click', showRegisterForm);
  $('.show__login').on('click', showLoginForm);

  $('#btnModalTrailer').on('click', function() {
    // if(!$('[data-trailer-id]')[0]) return;
    $('#modalTrailer').attr('style', 'display: flex;');
    $('body').addClass('ov__hidden');
    $('.preloading__stream__trailer').removeClass('d-none');
  });

  $(document).on("click.card__info__user",function(event) {
    var target = $(event.target);   
    // console.log($('.grab_audio').hasClass('d-none'));
    if(!$('.card__info__user').hasClass('d-none')) {
      if (!target.closest(".card__info__user").length && !target.closest("#btnModalLogin").length && !target.closest("#modalAddInfo").length) {
        // closeMenu(function() {
        //     $(document).off("click.grab_audio");
        // });
        $('.card__info__user').removeClass('d-flex-show');
      }      
    }
  });

  $('#btnModalLogin').on('click', function() {
    if($(this).attr('data-login-start')) {
      
      $('.card__info__user').toggleClass('d-flex-show');
    } else {
      $('#modalLogin').attr('style', 'display: flex;');
      $('body').addClass('ov__hidden');
    }
    
  });

  $('.exit__session').on('click', async function() {
     let response = await fetch('/logout');
     let res = await response.json();
     if(res.success) {
       $('.img__user').attr('src', '/img/user_change.PNG');
       $('#btnModalLogin').removeAttr('data-login-start');
       $(this).parent().removeClass('d-flex-show');
       $('#btnModalLogin').removeClass('started__login');
       $('.my__foto__comment').attr('src', '/img/user_change.PNG');
       $('.my__foto__subcomment').attr('src', '/img/user_change.PNG');
       $('.indicator__response__user').removeClass('d-flex-show');
       $('.my__subcomment__content').removeClass('d-flex-show');
       $('.save__lista__video').removeClass('lista__added');
       $('.save__lista__video').html(`Agregar a mi lista`);
       $('.like__video').find('i').replaceWith(`<i class="far fa-thumbs-up"></i>`);
       $('.like__video').removeClass('reaction__active__video');
       $('.dislike__video').find('i').replaceWith(`<i class="far fa-thumbs-down"></i>`);
       $('.dislike__video').removeClass('reaction__active__video');
       $('.like__action').find('i').replaceWith(`<i class="far fa-thumbs-up"></i>`);
       $('.like__action').removeClass('reaction__comment__active');
       $('.dislike__action').find('i').replaceWith(`<i class="far fa-thumbs-down"></i>`);
       $('.dislike__action').removeClass('reaction__comment__active');
       $('.like__action__sub').find('i').replaceWith(`<i class="far fa-thumbs-up"></i>`);
       $('.like__action__sub').removeClass('reaction__comment__active');
       $('.dislike__action__sub').find('i').replaceWith(`<i class="far fa-thumbs-down"></i>`);
       $('.dislike__action__sub').removeClass('reaction__comment__active');
       $('.active__reply').removeClass('active__reply');
       if(location.href.includes('/my-list')) {
         location.href = '/';
       }
     }
  });

  $('.my__account').on('click', function() {
    $('#modalAddInfo').attr('style', 'display: flex;');

  });

  function showSuccessLogin() {
    $('.success__alert__login').addClass('show');
      setTimeout(function() {
        $('.success__alert__login').removeClass('show');
      },2500);
  }

  $('#formLogin').on('submit', async function(e) {
    e.preventDefault();
    $('.login__enter').html(`<div class="la-ball-clip-rotate la-light la-sm">
    <div></div>`);
    let $form = this;
    let formData = new FormData($form);
    let response = await fetch('/verificarLogin', {
      method: 'POST',
      body: formData,
    });
    let res = await response.json();
    if(res.success) {
      $('#modalLogin').attr('style', 'display: none;');
      $('body').removeClass('ov__hidden');
      showSuccessLogin();
      $('#btnModalLogin').attr('data-login-start', 'start');
      $('#btnModalLogin').addClass('started__login');
      $('.foto__user').find('img').attr('src', res.user.foto);
      $('.name__user__info').text(res.user.name);
      $('.email__user__info').text(res.user.user);
      $('#btnModalLogin').attr('data-name-user', res.user.name);
      $('#btnModalLogin').attr('data-email-user', res.user.user);
      $('#btnModalLogin').attr('data-foto-user', res.user.foto);
      $('#btnModalLogin').attr('data-user-id', res.user.id);
      // console.log(res.foto);
      $('.my__foto__comment').attr('src', res.user.foto);
      $('.my__foto__subcomment').attr('src', res.user.foto);
      // console.log(res);
      if($('.stream__video')[0]) {
        let video_id = _id_video;
        let veriWatchVideo = res.watchlist.find((v) => v.video_id == video_id);
        // console.log(veriWatchVideo);
        if(veriWatchVideo) {
          $('.save__lista__video').addClass('lista__added');
          $('.save__lista__video').html(`Agregado a mi lista`);
        } else {
          $('.save__lista__video').removeClass('lista__added');
          $('.save__lista__video').html(`Agregar a mi lista`);
        }
      }
      $('.form__login input').removeClass('invalid__input');
      $('.error__pass').removeClass('show');
    } else {
      $('.form__login input').addClass('invalid__input');
      errorPassLogin('Datos incorrectos');
    }
    $('.login__enter').html(`Crear una cuenta`);
  });

  function errorPassLogin(msg) {
    $('.error__pass').addClass('show');
    $('.msg__text__error').text(msg)
  }

  function successLogin(msg) {
    $('.success__alert').addClass('show');
    setTimeout(function() {
      $('.msg__success').text(msg);
      $('.success__alert').removeClass('show');
    }, 2500);
  }

  $('#formRegister').on('submit', async function(e) {
    e.preventDefault();
    $('.login__enter').html(`<div class="la-ball-clip-rotate la-light la-sm">
    <div></div>`);
    let $form = this;
    let formData = new FormData($form);
    let name = formData.get('name');
    let email = formData.get('email');
    let pass1 = formData.get('password');
    let pass2 = formData.get('password2');
    if(pass1 != pass2) {
      $('.form__login__register #password,.form__login__register #password2').addClass('invalid__input');
      errorPassLogin('Las contraseñas no coinciden');
      $('.login__enter').html(`Crear una cuenta`);
      return;
    }
    let response = await fetch('/saveUser', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password:pass1
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    let res = await response.json();
    if(res.success) {
      showLoginForm();
      successLogin('Se ha registrado exitosamente, por favor ahora inicie sesión.');
    } else {
      errorPassLogin('El usuario ingresado ya existe');
    }
    $('.login__enter').html(`Crear una cuenta`);
  });
  
  $('body').on('click', '.close', function() {
    $(this).parent().parent().attr('style', 'display: none;');
    $('body').removeClass('ov__hidden');
    if($(this).parent().parent().attr('id') == 'modalTrailer') {
      $('#player__trailer').removeAttr('src');
    }
  }); 
  

  
  $('.movie__trailer').on('click', async function() {
    if(!this.dataset.trailerId) {
      let searchQueryTrailer = this.dataset.targetSearch;
      let trailerId = await fetch(`/getTrailer/${searchQueryTrailer}`);
      let resTrailerId = await trailerId.text();
      this.dataset.trailerId = resTrailerId;
    }
    
    let resId = this.dataset.trailerId;
    // if($('[data-target-loaded=loaded]')[0]) {
    //   return;
    // }
    
    $('#player__trailer').attr('src', `https://www.youtube.com/embed/${resId}?autoplay=1`);
    $('#player__trailer').attr('data-target-loaded', 'loaded');
    // console.log(res);
  });
  $('#player__trailer').on('load',function() {
    if($('#modalTrailer').is(':hidden')) {
      $(this).removeAttr('src');
    }
    $('.preloading__stream__trailer').addClass('d-none');
  });
  if(numberPages) {
    if(!location.href.includes('/generos/')) {
      if(location.href.includes('/year/')) {
        let numVeriPages = 0;
        if(numberPages == 0) {
          $('.content_img_videos').html(`<div class="not__found">No se encontraron resultados.</div>`);
          return;
        };
        
        $('#pagination_container').twbsPagination({
          totalPages: numberPages,
          visiblePages: 4,
          startPage: parseInt(currentPage),
          prev: '<span aria-hidden="true">&laquo;</span>',
          next: '<span aria-hidden="true">&raquo;</span>',
          onPageClick: async function (event, page) {
            
            numVeriPages ++;
            let response;
            if(numVeriPages > 1) {
              $('.content_img_videos').html(`<div class="preloading__items__video"><div class="la-ball-clip-rotate la-light la-sm">
              <div></div>
          </div></div>`);
              if(location.href.includes('/peliculas')) {
                history.pushState(null, "", `/year/${year}/peliculas?page=${page}`);
                response = await fetch(`/getFindYearType/${page}/peliculas?year=${year}`);
              } else
              if(location.href.includes('/series')) {
                history.pushState(null, "", `/year/${year}/series?page=${page}`);
                response = await fetch(`/getFindYearType/${page}/series?year=${year}`);
              } else {
                history.pushState(null, "", `/year/${year}?page=${page}`);
                response = await fetch(`/getFindYear/${page}?year=${year}`);
              }
                
                
                let res = await response.json();
                let newHTML = '';
                res.forEach((v) => {
                  if(v.type == 'Pelicula') {
                    newHTML += `<a href="/${'pelicula'}/${v._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
                    <div class="type__video__indicator__peli">Película</div>
                    <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
                    <p class="title-video">${v.title} (${v.year})</p>
                    <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
                  </a>`;
                  } else {
                    newHTML += `<a href="/${'serie'}/${v._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
                    <div class="type__video__indicator__serie">Serie</div>
                    <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
                    <p class="title-video">${v.title} (${v.year})</p>
                    <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
                  </a>`;
                  }
                  
                });
                $('.content_img_videos').html(newHTML);
                $('.title_videos_last').html(`Lista completa de ${sectionPage} Año: ${year} pagina ${page} latino Online Gratis HD`);
                addPreLoadingImg();
                addTooltip();
                // 
      
                // location.href = `/peliculas/pages/${page}`;
              window.scroll({
                top: 0,
                behavior: 'smooth'
              });
            }   
  
          }
      });
      } else
      if(location.href.includes('/search/')) {
        let numVeriPages = 0;
        if(numberPages == 0) {
          $('.content_img_videos').html(`<div class="not__found">No se encontraron resultados.</div>`);
          return;
        };
        $('#pagination_container').twbsPagination({
          totalPages: numberPages,
          visiblePages: 4,
          startPage: parseInt(currentPage) || 1,
          prev: '<span aria-hidden="true">&laquo;</span>',
          next: '<span aria-hidden="true">&raquo;</span>',
          onPageClick: async function (event, page) {
            numVeriPages ++;
      
            
            if(numVeriPages > 1) {
              $('.content_img_videos').html(`<div class="preloading__items__video"><div class="la-ball-clip-rotate la-light la-sm">
              <div></div>
          </div></div>`);
                history.pushState(null, "", `/search/${titleSearchInit}?page=${page}`);
                let response = await fetch(`/searchVideo/${titleSearchInit}?page=${page}`);
                let res = await response.json();
                let newHTML = '';
                res.movies.forEach((v) => {
                  if(v.type == 'Pelicula') {
                    newHTML += `<a href="/${'pelicula'}/${v._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
                    <div class="type__video__indicator__peli">Película</div>
                    <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
                    <p class="title-video">${v.title} (${v.year})</p>
                    <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
                  </a>`;
                  } else {
                    newHTML += `<a href="/${'serie'}/${v._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
                    <div class="type__video__indicator__serie">Serie</div>
                  <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
                  <p class="title-video">${v.title} (${v.year})</p>
                  <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
                </a>`;
                  }
                  
                });
                $('.content_img_videos').html(newHTML);
                $('.title_videos_last').html(`Estas buscando: ${titleSearchInit} pagina ${page} latino HD`);
                addPreLoadingImg();
                addTooltip();
                // 
              window.scroll({
                top: 0,
                behavior: 'smooth'
              });
            }       
          }
      });
      } else if(location.href.includes('/my-list')) {
        // console.log(numberPages);
        let numVeriPages = 0;
      if(numberPages == 0) {
        $('.content_img_videos').html(`<div class="not__found">No se encontraron resultados.</div>`);
        return;
      };
      $('#pagination_container').twbsPagination({
        totalPages: numberPages,
        visiblePages: 4,
        startPage: parseInt(currentPage),
        prev: '<span aria-hidden="true">&laquo;</span>',
        next: '<span aria-hidden="true">&raquo;</span>',
        onPageClick: async function (event, page) {
          numVeriPages ++;
          let response;
          if(numVeriPages > 1) {
            $('.content_img_videos').html(`<div class="preloading__items__video"><div class="la-ball-clip-rotate la-light la-sm">
              <div></div>
          </div></div>`);
              history.pushState(null, "", `/my-list/${page}`);
              response = await fetch(`/findMyList/${page}`);
              
              let res = await response.json();
              let newHTML = '';
              res.watchs.forEach((v) => {
                if(!v.seasons) {
                  newHTML += `<a href="/${'pelicula'}/${v.video_id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
                  <div class="type__video__indicator__peli">Película</div>
                  <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
                  <p class="title-video">${v.title} (${v.year})</p>
                  <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
                </a>`;
                } else {
                  newHTML += `<a href="/${'serie'}/${v.video_id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
                  <div class="type__video__indicator__serie">Serie</div>
                  <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
                  <p class="title-video">${v.title} (${v.year})</p>
                  <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
                </a>`;
                }
                
              });
              $('.content_img_videos').html(newHTML);
              $('.title_videos_last').html(`Mi lista - pagina ${page}`);
              addPreLoadingImg();
              addTooltip();
              // 
    
              // location.href = `/peliculas/pages/${page}`;
            window.scroll({
              top: 0,
              behavior: 'smooth'
            });
          }       
        }
    });
      } else {
        let numVeriPages = 0;
        if(numberPages == 0) {
          $('.content_img_videos').html(`<div class="not__found">No se encontraron resultados.</div>`);
          return;
        };
        $('#pagination_container').twbsPagination({
          totalPages: numberPages,
          visiblePages: 4,
          startPage: parseInt(currentPage),
          prev: '<span aria-hidden="true">&laquo;</span>',
          next: '<span aria-hidden="true">&raquo;</span>',
          onPageClick: async function (event, page) {
            numVeriPages ++;
      
            
            if(numVeriPages > 1) {
              $('.content_img_videos').html(`<div class="preloading__items__video"><div class="la-ball-clip-rotate la-light la-sm">
              <div></div>
          </div></div>`);
              if(sectionPage == 'Peliculas') {
                
                history.pushState(null, "", `/peliculas/${page}`);
                let response = await fetch(`/findPeliculas/${page}`);
                let res = await response.json();
                let newHTML = '';
                res.forEach((v) => {
                  newHTML += `<a href="/${'pelicula'}/${v._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
                  <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
                  <p class="title-video">${v.title} (${v.year})</p>
                  <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
                </a>`;
                });
                $('.content_img_videos').html(newHTML);
                $('.title_videos_last').html(`Lista completa de Peliculas Pagina: ${page} online en hd gratis`);
                addPreLoadingImg();
                addTooltip();
                // 
      
                // location.href = `/peliculas/pages/${page}`;
              } else if(sectionPage == 'Series') {
                
                history.pushState(null, "", `/series/${page}`);
                let response = await fetch(`/findSeries/${page}`);
                let res = await response.json();
                let newHTML = '';
                res.forEach((v) => {
                  newHTML += `<a href="/${'serie'}/${v._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
                  <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
                  <p class="title-video">${v.title} (${v.year})</p>
                  <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
                </a>`;
                });
                $('.content_img_videos').html(newHTML);
                $('.title_videos_last').html(`Lista completa de Series Pagina: ${page} online en hd gratis`);
                addPreLoadingImg();
                addTooltip();
                // 
              }
              window.scroll({
                top: 0,
                behavior: 'smooth'
              });
            }       
          }
      });
      }
      
    } else {

      let numVeriPages = 0;
      if(numberPages == 0) {
        $('.content_img_videos').html(`<div class="not__found">No se encontraron resultados.</div>`);
        return;
      };
      $('#pagination_container').twbsPagination({
        totalPages: numberPages,
        visiblePages: 4,
        startPage: parseInt(currentPage),
        prev: '<span aria-hidden="true">&laquo;</span>',
        next: '<span aria-hidden="true">&raquo;</span>',
        onPageClick: async function (event, page) {
          numVeriPages ++;
          let response;
          if(numVeriPages > 1) {
            $('.content_img_videos').html(`<div class="preloading__items__video"><div class="la-ball-clip-rotate la-light la-sm">
              <div></div>
          </div></div>`);
            if(location.href.includes('/peliculas')) {
              history.pushState(null, "", `/generos/${genero}/peliculas?page=${page}`);
              response = await fetch(`/getFindGenreType/${page}/peliculas?genero=${genero}`);
            } else
            if(location.href.includes('/series')) {
              history.pushState(null, "", `/generos/${genero}/series?page=${page}`);
              response = await fetch(`/getFindGenreType/${page}/series?genero=${genero}`);
            } else {
              history.pushState(null, "", `/generos/${genero}?page=${page}`);
              response = await fetch(`/getFindGenre/${page}?genero=${genero}`);
            }
              
              
              let res = await response.json();
              let newHTML = '';
              res.forEach((v) => {
                if(v.type == 'Pelicula') {
                  newHTML += `<a href="/${'pelicula'}/${v._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
                  <div class="type__video__indicator__peli">Película</div>
                  <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
                  <p class="title-video">${v.title} (${v.year})</p>
                  <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
                </a>`;
                } else {
                  newHTML += `<a href="/${'serie'}/${v._id}" class="carousel__elemento wave tooltip_auto" data-tippy-content="${v.title} (${v.year})">
                  <div class="type__video__indicator__serie">Serie</div>
                  <img class="image-loading" src="/img/placeholder-image.png" data-src="${v.image}" alt="">
                  <p class="title-video">${v.title} (${v.year})</p>
                  <div class="rating icon-star"><i class="fas fa-star"></i> <label class="score">${v.score}</label></div>
                </a>`;
                }
                
              });
              $('.content_img_videos').html(newHTML);
              $('.title_videos_last').html(`Lista completa de ${sectionPage} de género ${genero} Pagina: ${page} online en hd gratis`);
              addPreLoadingImg();
              addTooltip();
              // 
    
              // location.href = `/peliculas/pages/${page}`;
            window.scroll({
              top: 0,
              behavior: 'smooth'
            });
          }       
        }
    });
    }
  }
  
});



window.addEventListener('load', function() {
  if($('.carousel')[0]) {
    new Glider(document.querySelector('.carousel__lista'), {
      slidesToShow: 10,
      slidesToScroll: 10,
      draggable: true,
      dots: '.carousel__indicadores',
      arrows: {
        prev: '.carousel__anterior',
        next: '.carousel__siguiente'
      },
      responsive: [
        {
          breakpoint: 0,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }, {
          breakpoint: 167,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }, {
          breakpoint: 330,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }
        , {
          breakpoint: 167*2,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          }
        }, {
          breakpoint: 167*3,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          }
        }, {
          breakpoint: 167*4,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          }
        }
        , {
          breakpoint: 167*5,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          }
        }, {
          breakpoint: 167*6,
          settings: {
            slidesToShow: 7,
            slidesToScroll: 7,
          }
        }, {
          breakpoint: 167*7,
          settings: {
            slidesToShow: 8,
            slidesToScroll: 8,
          }
        }, {
          breakpoint: 167*8,
          settings: {
            slidesToShow: 9,
            slidesToScroll: 9,
          }
        }
      ]
    });
    // let vecHeightTextP = [];
    // $('.carousel__lista .carousel__elemento .title-video').each(function() {
    //   vecHeightTextP.push($(this).height());
    //   // console.log($(this).height());
    // });
    // // console.log($('.carousel__lista .carousel__elemento').length);
    // let maxHeightTextP = Math.max(...vecHeightTextP);
    // $('.carousel__lista .carousel__elemento .title-video').each(function() {
    //   $(this).attr('style', `min-height: ${maxHeightTextP}px !important;`);
    // });
  }
  
});