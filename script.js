// slider start


(function () {
    "use strict";

    window.createSwiper = function (container, options, optimalSlideWidth) {
        var containerNode = typeof container === "string" ? document.querySelector(container) : container;
        var swiperParent = containerNode.parentElement;
        var controls = swiperParent.querySelector(".swiper-controls");
        var swiper = new Swiper(containerNode, options);

        var renderSwiper = function () {
            var slidesNum = Math.min(
                Math.ceil(window.innerWidth / optimalSlideWidth),
                swiper.slides.length
            );
            swiper.params.slidesPerView = slidesNum;
            swiper.params.slidesPerGroup = slidesNum;
            swiper.update();
            controls.style = slidesNum === swiper.slides.length ? "display: none" : "";
        };

        renderSwiper();
        window.addEventListener("resize", renderSwiper);

        var swiperDestroy = swiper.destroy;
        swiper.destroy = function () {
            swiperDestroy(true, true);
            window.removeEventListener("resize", renderSwiper);
        };

        swiper.hideControls = function () {
            controls.style = "display: none";
        };

        swiper.showControls = function () {
            controls.style = "";
        };

        return swiper;
    };

    window.createMobileSwiper = function (container, options, optimalSlideWidth, mobileWidth) {
        var swiper = window.createSwiper(container, options, optimalSlideWidth);

        var updateSwiper = function () {
            if (window.innerWidth > mobileWidth && swiper !== undefined) {
                swiper.hideControls();
                swiper.destroy();
                swiper = undefined;
            } else if (window.innerWidth <= mobileWidth && swiper === undefined) {
                swiper = window.createSwiper(container, options, optimalSlideWidth);
                swiper.showControls();
            }
        };

        window.addEventListener("resize", updateSwiper);
        updateSwiper();
    };

    var arrayMax = function (array) {
        return Math.max.apply(null, array);
    };

    var setSliderHeight = function (slider, slides) {
        slider.style.height = arrayMax(
            slides.map(function (slide) {
                return slide.offsetHeight;
            })
        ) + "px";
    };

    var translateIndex = function (index, slides, currentSlideIndex) {
        var translatedIndex = index - currentSlideIndex;
        return translatedIndex + slides.length * (translatedIndex < 0);
    };

    var positionSlide = function (slide, x, z) {
        slide.style.transform = "rotateY(-2deg) translate3d(" + x + "px, 0, " + z + "px)";
    };

    var Slider3D = function (sliderNode, visibleSlidesNum) {
        this.visibleSlidesNum = visibleSlidesNum;
        this.currentSlideIndex = 0;
        this.wrapper = sliderNode.querySelector(".swiper-wrapper");
        this.slides = Array.prototype.slice.call(sliderNode.getElementsByClassName("swiper-slide"));

        var renderer = this.render.bind(this);
        window.addEventListener("load", renderer);
        window.addEventListener("resize", renderer);
        this.render();

        var clickHandler = this.nextSlide.bind(this);
        var nextButton = sliderNode.querySelector(".button-next-slide");
            nextButton.style.zIndex = this.slides.length + 1;
            nextButton.addEventListener("click", clickHandler);

        this.destroy = function () {
            window.removeEventListener("load", renderer);
            window.removeEventListener("resize", renderer);
            nextButton.removeEventListener("click", clickHandler);
            this.wrapper.style = "";
            this.slides.forEach(function (slide) {
                slide.style = "";
            });
        };
    };

    Slider3D.prototype.displaySlide = function (slide, slideIndex) {
        var visibleIndex = translateIndex(slideIndex, this.slides, this.currentSlideIndex);
        positionSlide(slide, visibleIndex * 30, -visibleIndex * 20);
        slide.style.opacity = +(visibleIndex < this.visibleSlidesNum);
        slide.style.zIndex = this.slides.length - visibleIndex;
    };

    Slider3D.prototype.render = function () {
        setSliderHeight(this.wrapper, this.slides);
        this.slides.forEach(this.displaySlide.bind(this));
    };

    Slider3D.prototype.nextSlide = function () {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
        this.render();
    };

    window.create3DSlider = function (sliderNode, visibleSlidesNum) {
        var swiperContainer = sliderNode.querySelector(".swiper-container");
        var swiperOptions = {
            pagination: sliderNode.querySelector(".swiper-pagination"),
            paginationClickable: true,
            nextButton: sliderNode.querySelector(".swiper-controls .button-next-slide"),
            prevButton: sliderNode.querySelector(".swiper-controls .button-previous-slide"),
            spaceBetween: 20
        };

        var slider = window.createSwiper(swiperContainer, swiperOptions, 450);
        var mobileWidth = 992;
        var slider3DActive;

        var renderSlider = function () {
            if (window.innerWidth >= mobileWidth && !slider3DActive) {
                slider.showControls();
                slider.destroy();
                slider = new Slider3D(sliderNode, visibleSlidesNum);
                slider3DActive = true;
            } else if (window.innerWidth < mobileWidth && slider3DActive) {
                slider.destroy();
                slider = window.createSwiper(swiperContainer, swiperOptions, 450);
                slider3DActive = false;
            }
        };

        renderSlider();
        window.addEventListener("resize", renderSlider);
    };
})();


(function () {
    "use strict";

    var optimalSlideWidth = 430;



    var swiperOptions = {
        pagination: '.awards .swiper-pagination',
        paginationClickable: true,
        spaceBetween: 20,
        nextButton: ".awards .next-slide",
        prevButton: ".awards .previous-slide"
    };

    createSwiper('.awards .swiper-container', swiperOptions, optimalSlideWidth);

    window.addEventListener("load", function () {
        createSwiper(".quotes-slider", {
            pagination: ".quotes-slider .swiper-pagination",
            paginationClickable: true,
            nextButton: ".block-blue .next-slide",
            prevButton: ".block-blue .previous-slide"
        }, 450);
        createSwiper(".rewiew-front-page-mobile-slider", {
            pagination: ".rewiew-front-page-mobile-slider .swiper-pagination",
            paginationClickable: true,
            nextButton: ".block-blue .next-slide",
            prevButton: ".block-blue .previous-slide"
        }, 450);
    });

    create3DSlider(document.querySelector(".this-slider"), 2);
})();
// slider end