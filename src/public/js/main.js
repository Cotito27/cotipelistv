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

  $('.btnMoreVideos').on('click', function() {
    location.href = `/${$('button.active').text().toLowerCase()}`;
  });

  $('.option__available').on('click', function(e) {
    $('.preloading__stream').removeClass('d-none');
    $('#stream__media').attr('src', this.dataset.targetVideo);
  });
  $('#stream__media').on('load', function() {
    $('.preloading__stream').addClass('d-none');
  });

  $('.season__part').on('click', function() {
    $('.d-flex-show').removeClass('d-flex-show');
    $(`[data-target-temp=${$(this).attr('id')}]`).addClass('d-flex-show');
  });

  $('.search__icon').on('click', async function() {
    if($('.input__search').val() != '') {
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
        if(!item.seasons) {
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
        $('.search__icon').html(`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16" role="img" viewBox="0 0 512 512">
        <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
      </svg>`);  
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
              history.pushState(null, "", `/search/${titleVideo}?page=${page}`);
              let response = await fetch(`/searchVideo/${titleVideo}?page=${page}`);
              let res = await response.json();
              let newHTML = '';
              res.movies.forEach((v) => {
                if(!v.seasons) {
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
    $('.search__icon').html(`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16" role="img" viewBox="0 0 512 512">
    <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
  </svg>`);
  $('.search__icon').css('pointer-events', 'auto');
    }
  });
  $('.input__search').on('keyup', async function(e) {
    if(e.keyCode == 13) {
      e.preventDefault();
      if($(this).val() != '') {
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
        if(!item.seasons) {
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
        $('.search__icon').html(`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16" role="img" viewBox="0 0 512 512">
        <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
      </svg>`);  
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
              history.pushState(null, "", `/search/${titleVideo}?page=${page}`);
              let response = await fetch(`/searchVideo/${titleVideo}?page=${page}`);
              let res = await response.json();
              let newHTML = '';
              res.movies.forEach((v) => {
                if(!v.seasons) {
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
    $('.search__icon').html(`<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16" role="img" viewBox="0 0 512 512">
    <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
  </svg>`);
  $('.search__icon').css('pointer-events', 'auto');
      }
    }
    
   
  });
  // Get the modal
  var modal = document.getElementById("modalTrailer");

  // Get the button that opens the modal
  var btnModal = document.getElementById("btnModalTrailer");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal 
  if(btnModal) {
    btnModal.onclick = function() {
      modal.style.display = "block";
      $('body').addClass('ov__hidden');
      $('.preloading__stream__trailer').removeClass('d-none');
    }
  }
  

  // When the user clicks on <span> (x), close the modal
  if(span) {
    span.onclick = function() {
      modal.style.display = "none";
      $('#player__trailer').removeAttr('src');
      $('body').removeClass('ov__hidden');
    }
  }
 

  $('.movie__trailer').on('click', async function() {
    let searchQuery = this.dataset.targetSearch;
    // if($('[data-target-loaded=loaded]')[0]) {
    //   return;
    // }
    let response = await fetch(`/getTrailer/${searchQuery}`);
    let res = await response.text();
    $('#player__trailer').attr('src', `https://www.youtube.com/embed/${res}?autoplay=1`);
    $('#player__trailer').attr('data-target-loaded', 'loaded');
    // console.log(res);
  });
  $('#player__trailer').on('load',function() {
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
                  if(!v.seasons) {
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
                history.pushState(null, "", `/search/${titleSearchInit}?page=${page}`);
                let response = await fetch(`/searchVideo/${titleSearchInit}?page=${page}`);
                let res = await response.json();
                let newHTML = '';
                res.movies.forEach((v) => {
                  if(!v.seasons) {
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
                if(!v.seasons) {
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
  }
  
});