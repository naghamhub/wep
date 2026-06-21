 document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 1. شريط التقدم أثناء التمرير (Scroll Progress Bar)
    // ==========================================================================
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = progress + '%';
        });
    }

    // ==========================================================================
    // 2. الوضع الليلي (Dark Mode Toggle)
    // ==========================================================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateDarkModeIcon(currentTheme);

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateDarkModeIcon(newTheme);
        });
    }

    function updateDarkModeIcon(theme) {
        const icon = darkModeToggle.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }

    // ==========================================================================
    // 3. السلايدر السينمائي (Hero Cinematic Slider)
    // ==========================================================================
    const slides = document.querySelectorAll(".hero-slider .slide");
    const prevArrow = document.querySelector(".prev-arrow");
    const nextArrow = document.querySelector(".next-arrow");
    const dots = document.querySelectorAll(".slider-dots .dot");
    let currentSlide = 0;
    let slideInterval;
    const slideDelay = 5000;

    if (slides.length > 0) {
        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove("active"));
            dots.forEach(dot => dot.classList.remove("active"));
            
            slides[index].classList.add("active");
            dots[index].classList.add("active");
            currentSlide = index;
        };

        const nextSlide = () => {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next);
        };

        const prevSlide = () => {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev);
        };

        const startSlideShow = () => {
            slideInterval = setInterval(nextSlide, slideDelay);
        };

        const resetSlideShow = () => {
            clearInterval(slideInterval);
            startSlideShow();
        };

        // التحكم عبر الأسهم
        if (nextArrow && prevArrow) {
            nextArrow.addEventListener("click", () => {
                nextSlide();
                resetSlideShow();
            });

            prevArrow.addEventListener("click", () => {
                prevSlide();
                resetSlideShow();
            });
        }

        // التحكم عبر النقاط
        dots.forEach(dot => {
            dot.addEventListener("click", () => {
                const index = parseInt(dot.getAttribute("data-index"));
                if (index !== currentSlide) {
                    showSlide(index);
                    resetSlideShow();
                }
            });
        });

        // بدء التشغيل
        startSlideShow();
    }

    // ==========================================================================
    // 4. نظام العدادات الرقمية (Dynamic Stats Counter)
    // ==========================================================================
    const statCounters = document.querySelectorAll(".stat-card h2, .stat-card h2 span");

    if (statCounters.length > 0) {
        const runCounter = (counter) => {
            const target = parseInt(counter.getAttribute("data-target"));
            if (!target || isNaN(target)) return;
            
            let count = 0;
            const duration = 2000;
            const step = Math.max(1, Math.floor(target / 60));
            
            const update = () => {
                count += step;
                if (count < target) {
                    counter.innerText = count;
                    requestAnimationFrame(update);
                } else {
                    counter.innerText = target;
                }
            };
            
            // استخدام requestAnimationFrame لتحسين الأداء
            let startTime = null;
            const animateCounter = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const currentCount = Math.floor(progress * target);
                counter.innerText = currentCount;
                if (progress < 1) {
                    requestAnimationFrame(animateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            
            requestAnimationFrame(animateCounter);
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    runCounter(counter);
                    statsObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        statCounters.forEach(counter => statsObserver.observe(counter));
    }

    // ==========================================================================
    // 5. تأثيرات الظهور التتابعي (Staggered Entry Effects)
    // ==========================================================================
    const fadeElements = document.querySelectorAll(".fade-element, .premium-card, .testimonial-card, .stat-card");

    if (fadeElements.length > 0) {
        const entryObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add("appear");
                    }, index * 80);
                    entryObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(el => entryObserver.observe(el));
    }

    // ==========================================================================
    // 6. التحكم الذكي بحقل الجنسية في صفحة التسجيل
    // ==========================================================================
    const nationalitySelect = document.getElementById("nationality");
    const otherNationalityBox = document.getElementById("otherNationalityBox");

    if (nationalitySelect && otherNationalityBox) {
        nationalitySelect.addEventListener("change", function() {
            if (this.value === "Other") {
                otherNationalityBox.style.display = "block";
                otherNationalityBox.style.opacity = "0";
                setTimeout(() => {
                    otherNationalityBox.style.opacity = "1";
                    otherNationalityBox.style.transition = "opacity 0.4s ease";
                }, 10);
            } else {
                otherNationalityBox.style.display = "none";
            }
        });
    }

    // ==========================================================================
    // 7. إضافة تأثير الهيدر عند التمرير (Header Scroll Effect)
    // ==========================================================================
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    console.log('🚀 روضة جيل الإبداع - تم التحميل بنجاح!');
});