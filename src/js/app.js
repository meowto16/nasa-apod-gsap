require('../css/app.css');
require('../scss/nasa-loader.scss');
require('../scss/style.scss');

const loadImage = require('./util/load-image')

const apod = require('./services/planetary/apod');

window.addEventListener('load', ((async () => {
  let currentDate = new Date()

  const contentTemplate = ({ url, title, explanation, date }) => {
    const d = new Date(date)
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const dateFormatted = `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`

    return `
      <div class="nasa">
        <div class="nasa__bg">
          <div class="nasa__bg-overlay"></div>
          <img class="nasa__bg-image" src="${url}" alt="${title}" />  
        </div>
        <div class="nasa__about">
          <h1 class="nasa__title">${title}</h1>
          <time class="nasa__date">${dateFormatted}</time>
          <p class="nasa__desc">${explanation}</p>
        </div>
      </div>
    `
  }

  /**
   * @param {Date} [itemDate]
   * @param {Boolean} init Is init image change
   * @returns {Promise<void>}
   */
  const changeImage = async (itemDate = new Date(), init = false) => {
    const [{ data: { url, date, title, explanation } }] = await Promise.all([
      apod.get({ date: itemDate }),
      gsap
        .timeline()
        .to('.loader', { zIndex: 9999, opacity: init ? 1 : 0.6, duration: 0.01 })
        .add('showon')
        .to('.loader', { duration: 0.45, clipPath: 'circle(100%)', opacity: 1 }, 'showon')
        .to('.loader > *', { duration: 0.45, scale: 1 }, 'showon')
    ])

    await loadImage(url);

    document.querySelector('.content__html').innerHTML = contentTemplate({ url, date, title, explanation });

    gsap
      .timeline()
      .to('.content .nasa .nasa__bg', { scale: 1.5, duration: 0.01 })
      .to('.content .nasa .nasa__about', { clipPath: 'polygon(0% 100%, 0% 100%, 100% 100%, 100% 100%)', opacity: 0, duration: 0.01 })
      .to('.content .nasa .nasa__bg-overlay', { background: 'rgba(0,0,0,1)', duration: 0.01 })
      .to('.loader', { duration: 1 })
      .to('.loader > *', { duration: 0.3, scale: 0 })
      .to('.loader', { duration: 0.3, opacity: 0 })
      .add('showup', '-=0.3')
      .to('.loader', { zIndex: -9999, clipPath: 'circle(0%)', duration: 0.01 })
      .to('.content .nasa .nasa__bg', { duration: 0.9, scale: 1.2, transition: 'ease-out' }, 'showup')
      .to('.content .nasa .nasa__bg-overlay', { background: 'rgba(0,0,0,0.65)', duration: 0.6 }, 'showup')
      .add('view')
      .to('.content .nasa .nasa__bg', { duration: 10, scale: 1, transition: 'ease-in' }, 'view')
      .to('.content .nasa .nasa__bg-overlay', { duration: 10, background: 'rgba(0,0,0,0.45)', transition: 'ease-in' }, 'view')
      .to('.content .nasa .nasa__about', { duration: 0.6, clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)', opacity: 1 }, 'view')
  }

  const goToPrevDay = async () => {
    currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1))
    await changeImage(currentDate)
  }

  const goToNextDay = async () => {
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
    await changeImage(currentDate)
  }

  await changeImage(currentDate, true)

  document.querySelector('.js-go-to-prev-day').addEventListener('click', goToPrevDay)
  document.querySelector('.js-go-to-next-day').addEventListener('click', goToNextDay)
})))
