const pageLoader = document.getElementById('pageLoader');
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav-link');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const scrollTop = document.getElementById('scrollTop');
const scrollIndicator = document.getElementById('scrollIndicator');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

const contactForm = document.getElementById('contactForm');
const customCursor = document.getElementById('customCursor');
const typedText = document.querySelector('.typed-text');
const statValues = document.querySelectorAll('.stat-value');
// const testimonialCards = document.querySelectorAll('.testimonial-card');
// const testimonialPrev = document.getElementById('testimonialPrev');
// const testimonialNext = document.getElementById('testimonialNext');

let currentTestimonial = 0;
let typedIndex = 0;
let charIndex = 0;
let typingForward = true;

window.addEventListener('load', () => {
  pageLoader.style.display = 'none';
  document.body.classList.add('loaded');
});

const closeMenu = () => {
  navMenu.classList.remove('open');
  mobileToggle.setAttribute('aria-expanded', 'false');
};

const openMenu = () => {
  navMenu.classList.add('open');
  mobileToggle.setAttribute('aria-expanded', 'true');
};

mobileToggle.addEventListener('click', () => {
  if (navMenu.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

const typeLoop = () => {
  if (!typedText || !typedText.dataset.words) return;
  const words = typedText.dataset.words.split(',');
  const currentWord = words[typedIndex];

  if (typingForward) {
    charIndex += 1;
    if (charIndex >= currentWord.length) {
      typingForward = false;
      setTimeout(typeLoop, 1200);
      return;
    }
  } else {
    charIndex -= 1;
    if (charIndex <= 0) {
      typingForward = true;
      typedIndex = (typedIndex + 1) % words.length;
    }
  }

  typedText.textContent = currentWord.slice(0, charIndex);
  setTimeout(typeLoop, typingForward ? 120 : 50);
};

typeLoop();

const allRevealables = document.querySelectorAll('.section, .skill-card, .service-card, .timeline-item, .project-card, .testimonial-card, .contact-card');
allRevealables.forEach((element) => element.classList.add('reveal-hidden'));

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const stat = entry.target;
      const target = parseInt(stat.dataset.target, 10);
      let current = 0;

      const count = () => {
        const step = Math.max(1, Math.ceil(target / 24));
        current += step;
        if (current > target) current = target;
        stat.textContent = current;
        if (current < target) {
          requestAnimationFrame(count);
        }
      };

      count();
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.4 }
);

statValues.forEach((stat) => counterObserver.observe(stat));

window.addEventListener('scroll', () => {
  const scroll = window.scrollY;

  if (scroll > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  const progress = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollIndicator.style.width = `${progress}%`;

  if (scroll > 500) {
    scrollTop.classList.add('visible');
  } else {
    scrollTop.classList.remove('visible');
  }

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (!section) return;

    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (scroll >= sectionTop && scroll < sectionTop + sectionHeight) {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('light-theme');
  themeToggle.classList.toggle('dark');
});

scrollTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    button.classList.add('active');

    const category = button.dataset.category;
    projectCards.forEach((card) => {
      const isVisible = category === 'all' || card.dataset.category === category;
      card.style.display = isVisible ? 'block' : 'none';
    });
  });
});

// const showTestimonial = (index) => {
//   testimonialCards.forEach((card, idx) => {
//     card.classList.toggle('active', idx === index);
//   });
// };

// if (testimonialPrev && testimonialNext && testimonialCards.length > 0) {
//   testimonialPrev.addEventListener('click', () => {
//     currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
//     showTestimonial(currentTestimonial);
//   });

//   testimonialNext.addEventListener('click', () => {
//     currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
//     showTestimonial(currentTestimonial);
//   });
//   showTestimonial(0);
// }

contactForm.addEventListener('submit', (event) => {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');

  const errors = {
    name: name.value.trim() === '',
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value),
    message: message.value.trim() === '',
  };

  document.getElementById('nameError').textContent = errors.name ? 'Please enter your name.' : '';
  document.getElementById('emailError').textContent = errors.email ? 'Please enter a valid email.' : '';
  document.getElementById('messageError').textContent = errors.message ? 'Please enter a message.' : '';

  if (errors.name || errors.email || errors.message) {
    event.preventDefault();
    document.getElementById('formStatus').textContent = 'Please fix the errors above.';
    document.getElementById('formStatus').style.color = '#ff7f8d';
    return;
  }

  // Allow the form to submit normally (so the backend/email handler can send you the message)
  document.getElementById('formStatus').textContent = 'Sending message...';
  document.getElementById('formStatus').style.color = '#7c5cff';
});

window.addEventListener('mousemove', (event) => {
  customCursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
});

const interactiveElements = document.querySelectorAll('button, a, input, textarea');
interactiveElements.forEach((element) => {
  element.addEventListener('mouseenter', () => {
    customCursor.style.width = '38px';
    customCursor.style.height = '38px';
    customCursor.style.background = 'rgba(76, 211, 253, 0.55)';
  });
  element.addEventListener('mouseleave', () => {
    customCursor.style.width = '18px';
    customCursor.style.height = '18px';
    customCursor.style.background = 'rgba(124, 92, 255, 0.95)';
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
      }
    });
  },
  { threshold: 0.15 }
);

allRevealables.forEach((element) => revealObserver.observe(element));
