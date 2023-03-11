window.addEventListener('DOMContentLoaded', () => {

   //Tabs

   const tabs = document.querySelectorAll('.tabheader__item'),
         tabsContent = document.querySelectorAll('.tabcontent'),
         tabsParent = document.querySelector('.tabheader__items');

   function hideTabContent() {
      tabsContent.forEach(item => {
         // item.style.display = 'none';
         item.classList.add('hide');
         item.classList.remove('show', 'fade');
      });

      tabs.forEach(item => {
         item.classList.remove('tabheader__item_active');
      });
   }

   function showTabContent(i = 0) {       //если ф-ция вызывается без аргумента - то по умолчанию он будт 0
      // tabsContent[i].style.display = 'block';
      tabsContent[i].classList.add('show', 'fade');
      tabsContent[i].classList.remove('hide');
      tabs[i].classList.add('tabheader__item_active');
   }

   hideTabContent();
   showTabContent();

    tabsParent.addEventListener('click', (event) => {
       const target = event.target;

       if (target && target.classList.contains('tabheader__item')) {
          tabs.forEach((item, i) => {
             if (target == item) {                 //выясняем, что это именно тот таб который кликнул пользователь
                hideTabContent();
                showTabContent(i);
             }
          });
       }
    });

    //Timer

   const deadline = '2023-05-11';

   //ф-ция определяет разницу между дэдлайном и нашим текущим временем
   function getTimeRemaining(endtime) {
      let days, hours, minutes, seconds;
      const t = Date.parse(endtime) - Date.parse(new Date());

      if (t <= 0) {
         days = 0;
         hours = 0;
         minutes = 0;
         seconds = 0;
      } else {
         days = Math.floor(t / (1000 * 60 * 60 * 24)),
             hours = Math.floor((t / (1000 * 60 * 60) % 24)),
             minutes = Math.floor((t / 1000 / 60) % 60),
             seconds = Math.floor((t / 1000) % 60);
      }


      //чтобы мы могли эти переменные использовать вне ф-ции - возвращаем их в виде объекта
      return {
         'total': t,
         'days': days,
         'hours': hours,
         'minutes': minutes,
         'seconds': seconds
      };
   }

   //чтобы добавлялся 0 если число из одной цифры
   function getZero(num) {
      if (num >= 0 && num < 10) {
         return `0${num}`;
      }else{
         return  num;
      }
   }

   //ф-ция, которая устанавливает наш таймер на страничку
   function setClock(selector, endtime) {
      const timer = document.querySelector(selector),
          days = timer.querySelector('#days'),
          hours = timer.querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);               //ф-ция будет запускаться каждую секунду

      updateClock();                    //чтобы не было мигания верстки, изначальных значений, которые были на странице


      //ф-ция, которая будет обновлять наш таймер каждую секунду
      function updateClock() {
         const t = getTimeRemaining(endtime);    //расчет того времени, которое осталось на данную секунду

         days.innerHTML = getZero(t.days);
         hours.innerHTML = getZero(t.hours);
         minutes.innerHTML = getZero(t.minutes);
         seconds.innerHTML = getZero(t.seconds);

         if (t.total <= 0) {
            clearInterval(timeInterval);
         }
      }
   }

   setClock('.timer', deadline);

   //Modal

   const modalTrigger = document.querySelectorAll('[data-modal]'),
         modal = document.querySelector('.modal');

   function openModal() {
      modal.classList.add('show');
      modal.classList.remove('hide');
      // modal.classList.toggle('show');
      document.body.style.overflow = 'hidden';      //чтобы страница не прокручивалась когда появляется модальное окно
      clearInterval(modalTimerId);
   }

   modalTrigger.forEach(btn => {
       btn.addEventListener('click', openModal);
       });

   function closeModal(){
      modal.classList.add('hide');
      modal.classList.remove('show');
      // modal.classList.toggle('show');
      document.body.style.overflow = '';
   }

   modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.getAttribute('data-close') == '') {
         closeModal();
      }
   });

   document.addEventListener('keydown', (e) => {
      if (e.code === "Escape" && modal.classList.contains('show')) {
         closeModal();
      }
   });

   const modalTimerId = setTimeout(openModal, 50000);

   //делаем так чтобы модальное окно появлялось когда пользователь доходит до конца страницы
   function showModalByScroll() {
      if (window.pageYOffset + document.documentElement.clientHeight >=  document.documentElement.scrollHeight -1) {
         openModal();
         window.removeEventListener('scroll', showModalByScroll);
      }
   }

   window.addEventListener('scroll', showModalByScroll);



   //Используем классы для карточек

   class MenuCard {
      constructor(src, alt, title, descr, price, parentSelector, ...classes) {
         this.src = src;
         this.alt = alt;
         this.title = title;
         this.descr = descr;
         this.price = price;
         this.classes = classes;
         this.parent = document.querySelector(parentSelector);
         this.transfer = 27;
         this.changeToUAN();
      }

      changeToUAN()  {
         this.price = this.price * this.transfer;
      }

      render() {
         const element = document.createElement('div');
         if (this.classes.length === 0) {
            this.element = 'menu__item';
            element.classList.add(this.element);
         } else {
            this.classes.forEach(className => element.classList.add(className));
         }

         element.innerHTML = `
              <img src=${this.src} alt=${this.alt}>
              <h3 class="menu__item-subtitle">${this.title}</h3>
              <div class="menu__item-descr">${this.descr}</div>
              <div class="menu__item-divider"></div>
              <div class="menu__item-price">
                  <div class="menu__item-cost">Цена:</div>
                  <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
              </div>
         `;
         this.parent.append(element);                         // вставляем элемент в родительский элемент
      }
   }

   const getResource = async (url) => {
      const res = await fetch(url);

      if (!res.ok) {
         throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }

      return await res.json();
   };

   // getResource('http://localhost:3000/menu')
   //     .then(data => {
   //        //используем деструктуризацию, вытаскиваем свойства из объекта в файле db.json
   //        data.forEach(({img, altimg, title, descr, price}) => {
   //           new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
   //        });
   //     });

   axios.get('http://localhost:3000/menu')
       .then(data => {
          data.data.forEach(({img, altimg, title, descr, price}) => {
             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
          });
       });

   //другой способ, без шаблонизации

   // getResource('http://localhost:3000/menu')
   //     .then(data => createCard(data));
   //
   // function createCard(data) {
   //    data.forEach(({img, altimg, title, descr, price}) => {
   //       const element = document.createElement('div');
   //       price = price * 36;
   //       element.classList.add('menu__item');
   //
   //       element.innerHTML = `
   //            <img src=${img} alt=${altimg}>
   //            <h3 class="menu__item-subtitle">${title}</h3>
   //            <div class="menu__item-descr">${descr}</div>
   //            <div class="menu__item-divider"></div>
   //            <div class="menu__item-price">
   //                <div class="menu__item-cost">Цена:</div>
   //                <div class="menu__item-total"><span>${price}</span> грн/день</div>
   //            </div>
   //       `;
   //
   //       document.querySelector('.menu .container').append(element);
   //    })
   // }

   //Forms

   const forms = document.querySelectorAll('form');

   const message = {
      loading: 'img/form/spinner.svg',
      success: 'Thank You! We will call you soon!',
      failure: 'Something went wrong...'
   };

   forms.forEach(item => {
      bindPostData(item);
   });

   const postData = async (url, data) => {
      const res = await fetch(url, {
         method: "POST",
         headers: {
            'Content-type': 'application/json'
         },
         body: data
      });

      return await res.json();
   };

   function bindPostData(form) {
      form.addEventListener('submit', (e) => {
          e.preventDefault();                      //Обязательная команда чтобы отменить стандартное поведение браузера

         const statusMessage = document.createElement('img');
         statusMessage.src = message.loading;
         statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
         `;
         // form.append(statusMessage);
         form.insertAdjacentElement('afterend', statusMessage);    //так спиннер будет размещен внизу после формы

         const formData = new FormData(form);                            //формирует данные из формы в объект

         const json = JSON.stringify(Object.fromEntries(formData.entries()));

         postData('http://localhost:3000/requests', json)
            .then(data => {
               console.log(data);
               showThanksModal(message.success);
               statusMessage.remove();
         }).catch(() => {
            showThanksModal(message.failure);
         }).finally(() => {
            form.reset();                                            //сбрасываем форму после отправки данных
         });
      });
   }

   function showThanksModal(message) {
      const prevModalDialog = document.querySelector('.modal__dialog');

      prevModalDialog.classList.add('hide');
      openModal();

      const thanksModal = document.createElement('div');
      thanksModal.classList.add('modal__dialog');
      thanksModal.innerHTML = `
         <div class="modal__content">
            <div class="modal__close data-close">&times;</div>
            <div class="modal__title">${message}</div>
         </div>
      `;

      document.querySelector('.modal').append(thanksModal);
      setTimeout(() => {
         thanksModal.remove();
         prevModalDialog.classList.add('show');
         prevModalDialog.classList.remove('hide');
         closeModal();
      }, 4000);
   }

   // fetch('http://localhost:3000/menu')
   //     .then(data => data.json())
   //     .then(res => console.log(res));


   //Slider

   let slideIndex = 1;
   let offset = 0;

   const slides = document.querySelectorAll('.offer__slide'),
         slider = document.querySelector('.offer__slider'),
         prev = document.querySelector('.offer__slider-prev'),
         next = document.querySelector('.offer__slider-next'),
         total = document.querySelector('#total'),
         current = document.querySelector('#current'),
         slidesWrapper = document.querySelector('.offer__slider-wrapper'),
         slidesField = document.querySelector('.offer__slider-inner'),
         width = window.getComputedStyle(slidesWrapper).width;

   function showTotalNumberOfSlides(slides) {
      if (slides.length < 10) {
         total.textContent = `0${slides.length}`;
      } else {
         total.textContent = slides.length;
      }
   }

   function showCurrentSlideNumber(slides){
      if (slides.length < 10) {
         current.textContent = `0${slideIndex}`;
      } else {
         current.textContent = slideIndex;
      }
   }

   function changeDotStyle(dots){
      dots.forEach(dot => dot.style.opacity = '.5');
      dots[slideIndex - 1].style.opacity = 1;
   }

   showTotalNumberOfSlides(slides);
   showCurrentSlideNumber(slides);

   slidesField.style.width = 100 * slides.length + '%';
   slidesField.style.display = 'flex';
   slidesField.style.transition = '0.5s all';

   slidesWrapper.style.overflow = 'hidden';

   slides.forEach(slide => {
      slide.style.width = width;
   });

   slider.style.position = 'relative';

   const indicators = document.createElement('ol'),
         dots = [];

   indicators.classList.add('carousel-indicators');
   indicators.style.cssText = `
       position: absolute;
       right: 0;
       bottom: 0;
       left: 0;
       z-index: 15;
       display: flex;
       justify-content: center;
       margin-right: 15%;
       margin-left: 15%;
       list-style: none;
   `;
   slider.append(indicators);

   for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('li');
      dot.setAttribute('data-slide-to', i + 1);
      dot.style.cssText = `
          box-sizing: content-box;
          flex: 0 1 auto;
          width: 30px;
          height: 6px;
          margin-right: 3px;
          margin-left: 3px;
          cursor: pointer;
          background-color: #fff;
          background-clip: padding-box;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          opacity: .5;
          transition: opacity .6s ease;
      `;
      if (i == 0) {
         dot.style.opacity = 1;
      }
      indicators.append(dot);
      dots.push(dot);
   }

   next.addEventListener('click', () => {
      if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {  // '500px'(width) сначала конвертируем в число
         offset = 0;
      } else {
         offset += +width.slice(0, width.length - 2);
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == slides.length) {
         slideIndex = 1;
      } else {
         slideIndex++;
      }

      showCurrentSlideNumber(slides);
      changeDotStyle(dots);
   });

   prev.addEventListener('click', () => {
      if (offset == 0) {
         offset = +width.slice(0, width.length - 2) * (slides.length - 1);
      } else {
         offset -= +width.slice(0, width.length - 2);
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == 1) {
         slideIndex = slides.length;
      } else {
         slideIndex--;
      }

      showCurrentSlideNumber(slides);
      changeDotStyle(dots);
   });

   dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
         const slideTo = e.target.getAttribute('data-slide-to');

         slideIndex = slideTo;
         offset = +width.slice(0, width.length - 2) * (slideTo  - 1);

         slidesField.style.transform = `translateX(-${offset}px)`;

         showCurrentSlideNumber(slides);
         changeDotStyle(dots);
      });
   });

   // showSlides(slideIndex);
   //
   // if (slides.length < 10) {
   //    total.textContent = `0${slides.length}`;
   // } else {
   //    total.textContent = slides.length;
   // }
   //
   // function showSlides(n) {
   //    if (n > slides.length) {
   //       slideIndex = 1;
   //    }
   //
   //    if (n < 1) {
   //       slideIndex = slides.length;
   //    }
   //
   //    slides.forEach(item => item.style.display = 'none');
   //
   //    slides[slideIndex -1].style.display = 'block';
   //
   //    if (slides.length < 10) {
   //       current.textContent = `0${slideIndex}`;
   //    } else {
   //       current.textContent = slideIndex;
   //    }
   // }
   //
   // function plusSlides(n) {
   //    showSlides(slideIndex += n);
   // }
   //
   // prev.addEventListener('click', () => {
   //    plusSlides(-1);
   // });
   //
   // next.addEventListener('click', () => {
   //    plusSlides(1);
   // });
});








