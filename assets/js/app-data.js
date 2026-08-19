// Real (approximate) astronomical data + curated hotspots.
// TEXTURES / HOTSPOT_IMAGES are filled in at build time from the sourced image manifest.
// Any missing entry gracefully falls back to a procedurally generated visual.
var TEXTURES = {"texture_mercury": "assets/img/texture_mercury.jpg", "texture_venus": "assets/img/texture_venus.jpg", "texture_earth": "assets/img/texture_earth.jpg", "texture_mars": "assets/img/texture_mars.jpg", "texture_jupiter": "assets/img/texture_jupiter.jpg", "texture_saturn": "assets/img/texture_saturn.jpg", "texture_uranus": "assets/img/texture_uranus.jpg", "texture_neptune": "assets/img/texture_neptune.jpg"};
var HOTSPOT_IMAGES = {"hotspot_earth_everest": {"file": "assets/img/hotspot_earth_everest.jpg"}, "hotspot_earth_antarctica": {"file": "assets/img/hotspot_earth_antarctica.jpg"}, "hotspot_mars_olympus": {"file": "assets/img/hotspot_mars_olympus.jpg"}, "hotspot_mars_valles": {"file": "assets/img/hotspot_mars_valles.jpg"}, "hotspot_mars_surface": {"file": "assets/img/hotspot_mars_surface.jpg"}, "hotspot_jupiter_grs": {"file": "assets/img/hotspot_jupiter_grs.jpg"}, "hotspot_jupiter_bands": {"file": "assets/img/hotspot_jupiter_bands.jpg"}, "hotspot_saturn_rings_closeup": {"file": "assets/img/hotspot_saturn_rings_closeup.jpg"}, "hotspot_earth_amazon": {"file": "assets/img/hotspot_earth_amazon.jpg"}, "hotspot_earth_ocean": {"file": "assets/img/hotspot_earth_ocean.jpg"}, "hotspot_earth_city_lights": {"file": "assets/img/hotspot_earth_city_lights.jpg"}, "hotspot_venus_surface": {"file": "assets/img/hotspot_venus_surface.jpg"}, "hotspot_mercury_caloris": {"file": "assets/img/hotspot_mercury_caloris.jpg"}, "hotspot_mercury_craters": {"file": "assets/img/hotspot_mercury_craters.jpg"}, "hotspot_saturn_hexagon": {"file": "assets/img/hotspot_saturn_hexagon.jpg"}, "hotspot_uranus_rings": {"file": "assets/img/hotspot_uranus_rings.jpg"}, "hotspot_uranus_feature": {"file": "assets/img/hotspot_uranus_feature.jpg"}, "hotspot_neptune_dark_spot": {"file": "assets/img/hotspot_neptune_dark_spot.jpg"}, "hotspot_neptune_clouds": {"file": "assets/img/hotspot_neptune_clouds.jpg"}};
var CONTENT_IMAGES = {"sun_surface": "assets/img/sun_surface.jpg", "sun_corona": "assets/img/sun_corona.jpg", "kuiper_belt": "assets/img/kuiper_belt.jpg", "pluto_surface": "assets/img/pluto_surface.jpg", "moon_luna": "assets/img/moon_luna.jpg", "moon_io": "assets/img/moon_io.jpg", "moon_europa": "assets/img/moon_europa.jpg", "moon_ganymede": "assets/img/moon_ganymede.jpg", "moon_titan": "assets/img/moon_titan.jpg", "moon_triton": "assets/img/moon_triton.jpg"};

var SUN = {
  name:'СОЛНЦЕ',
  epithet:'99,86% массы всей системы сосредоточено в одном светиле',
  paragraphs:[
    'Каждую секунду Солнце превращает в энергию около 600 миллионов тонн водорода. Пятна на поверхности — области пониженной температуры, где магнитные поля подавляют перенос тепла; несмотря на тёмный вид, каждое из них ярче полной Луны.',
    'Корону — разрежённую внешнюю атмосферу, разогретую до миллионов градусов, — почти никогда не видно из-за яркости самого диска. Она проявляется только во время полного затмения, когда Луна точно закрывает Солнце.'
  ],
  stats:[['Диаметр','1 392 700 км'],['Температура поверхности','~5 500 °C'],['Температура ядра','~15 000 000 °C'],['Возраст','4,6 млрд лет'],['Тип звезды','жёлтый карлик, G2V'],['Свет до Земли','8 мин 20 сек']],
  images:[
    {key:'sun_surface', label:'Поверхность', caption:'Грануляция и пятна на фотосфере Солнца.'},
    {key:'sun_corona', label:'Корона', caption:'Внешняя атмосфера Солнца, видимая во время полного затмения.'}
  ]
};

var MOONS = [
  {id:'luna', name:'Луна', of:'Земля', image:'moon_luna',
    epithet:'Единственное тело за пределами Земли, на которое ступал человек',
    fact:'Диаметр 3 474 км · среднее расстояние 384 400 км'},
  {id:'io', name:'Ио', of:'Юпитер', image:'moon_io',
    epithet:'Самое вулканически активное тело Солнечной системы',
    fact:'Более 400 действующих вулканов'},
  {id:'europa', name:'Европа', of:'Юпитер', image:'moon_europa',
    epithet:'Под ледяной коркой скрыт океан — возможное место для жизни',
    fact:'Подлёдный океан глубже всех земных'},
  {id:'ganymede', name:'Ганимед', of:'Юпитер', image:'moon_ganymede',
    epithet:'Крупнейший спутник Солнечной системы — больше Меркурия',
    fact:'Диаметр 5 268 км'},
  {id:'titan', name:'Титан', of:'Сатурн', image:'moon_titan',
    epithet:'Единственный спутник с плотной атмосферой и жидкостью на поверхности',
    fact:'Озёра из жидкого метана и этана'},
  {id:'triton', name:'Тритон', of:'Нептун', image:'moon_triton',
    epithet:'Вращается в обратную сторону — вероятно, захваченный объект',
    fact:'Активные азотные гейзеры'}
];

var PLANETS = [
  {
    id:'mercury', order:1, kind:'rocky', name:'МЕРКУРИЙ',
    epithet:'Ближе всех — и обжигает, и морозит',
    dist:'57,9 млн км от Солнца',
    color:0x9C9490, colorCss:'#9C9490',
    axialTilt:0.03, rotDur:46,
    paragraphs:[
      'Перепад температур на Меркурии — 600 градусов между днём и ночью: атмосферы, способной удержать тепло, здесь попросту нет.',
      'Крутите планету — поверхность сплошь покрыта древними кратерами: она застыла в таком виде миллиарды лет назад.',
      'Первым к Меркурию подобрался «Маринер-10» в 1974–75 годах, пролетев мимо трижды. Детальную карту составил зонд MESSENGER, вышедший на орбиту только в 2011 году — почти 40 лет спустя.'
    ],
    stats:[['Диаметр','4 879 км'],['От Солнца','57,9 млн км'],['Год','88 дней'],['Сутки','176 дней'],['Спутники','0'],['Первая миссия','Маринер-10, 1974']],
    textureKey:'texture_mercury',
    hasRings:false,
    hotspots:[
      {id:'caloris', label:'Бассейн Калорис', lat:30.5, lon:-170.2, imageKey:'hotspot_mercury_caloris',
        caption:'Один из крупнейших ударных кратеров Солнечной системы — около 1550 км в поперечнике.'},
      {id:'craters', label:'Кратерированное плато', lat:-20, lon:60, imageKey:'hotspot_mercury_craters',
        caption:'Типичный ландшафт Меркурия: миллиарды лет без атмосферы сохранили древние кратеры почти нетронутыми.'}
    ]
  },
  {
    id:'venus', order:2, kind:'rocky', name:'ВЕНЕРА',
    epithet:'Горячее Меркурия, хотя дальше от Солнца',
    dist:'108,2 млн км от Солнца',
    color:0xDEBD82, colorCss:'#DEBD82',
    axialTilt:3.09, rotDur:64,
    paragraphs:[
      'Плотная атмосфера из углекислого газа работает как крышка кастрюли: поверхность круглосуточно раскалена до 465&nbsp;°C.',
      'Нажмите на планету — и увидите не облака, а радиолокационную карту настоящего рельефа под вечной облачностью.',
      'Первой мягкую посадку на другую планету совершила советская «Венера-7» в 1970 году. Радиолокационную карту всей поверхности составил американский зонд Magellan в начале 1990-х.'
    ],
    stats:[['Диаметр','12 104 км'],['От Солнца','108,2 млн км'],['Темп. поверхности','465 °C'],['Давление у поверхности','92 атм'],['Спутники','0'],['Первая посадка','Венера-7, 1970']],
    textureKey:'texture_venus',
    hasRings:false,
    hotspots:[
      {id:'surface', label:'Вулканические равнины', lat:0.5, lon:-165.4, imageKey:'hotspot_venus_surface',
        caption:'Радиолокационная карта Magellan показывает вулканы и лавовые равнины под вечным облачным покровом.'},
      {id:'clouds', label:'Облачный покров', lat:20, lon:40, imageKey:'hotspot_venus_clouds',
        caption:'Облака Венеры состоят из капель серной кислоты и полностью скрывают поверхность в видимом свете.'}
    ]
  },
  {
    id:'earth', order:3, kind:'rocky', name:'ЗЕМЛЯ',
    epithet:'Единственная точка, где кто-то читает эти строки',
    dist:'149,6 млн км от Солнца',
    color:0x3E7CB1, colorCss:'#3E7CB1',
    axialTilt:23.4, rotDur:20,
    paragraphs:[
      'Из восьми планет только здесь вода стабильно остаётся жидкой, а крупный спутник удерживает ось вращения от хаотичных колебаний.',
      'Покрутите глобус и нажмите на любую точку — сушу, океан, вершину или город: страница покажет, что там на самом деле.',
      'Магнитное поле Земли отклоняет большую часть солнечного ветра, а атмосфера ежедневно сжигает до 25 тонн метеоритного материала, не долетающего до поверхности.'
    ],
    stats:[['Диаметр','12 742 км'],['От Солнца','149,6 млн км'],['Наклон оси','23,4°'],['Возраст','4,54 млрд лет'],['Спутники','1 (Луна)'],['Атмосфера','78% N₂, 21% O₂']],
    textureKey:'texture_earth',
    hasRings:false,
    hotspots:[
      {id:'everest', label:'Эверест', lat:27.99, lon:86.92, imageKey:'hotspot_earth_everest',
        caption:'Высочайшая точка Земли — 8 849 м над уровнем моря, на границе Непала и Китая.'},
      {id:'sahara', label:'Сахара', lat:23, lon:13, imageKey:'hotspot_earth_sahara',
        caption:'Крупнейшая жаркая пустыня планеты — около 9 млн км² движущихся дюн и каменистых плато.'},
      {id:'amazon', label:'Амазония', lat:-3, lon:-60, imageKey:'hotspot_earth_amazon',
        caption:'Самый большой тропический лес Земли — дом примерно для 10% всех известных видов.'},
      {id:'ocean', label:'Тихий океан', lat:0, lon:-140, imageKey:'hotspot_earth_ocean',
        caption:'Свыше 70% поверхности Земли покрыто водой средней глубиной около 3,7 км.'},
      {id:'city_lights', label:'Мегаполис ночью', lat:35.68, lon:139.65, imageKey:'hotspot_earth_city_lights',
        caption:'Огни города, снятые с орбиты, — вид, реально доступный с Международной космической станции.'},
      {id:'antarctica', label:'Антарктида', lat:-80, lon:20, imageKey:'hotspot_earth_antarctica',
        caption:'Хранит около 60% всей пресной воды Земли в виде льда толщиной до 4 км.'}
    ]
  },
  {
    id:'mars', order:4, kind:'rocky', name:'МАРС',
    epithet:'Дом самой высокой горы Солнечной системы',
    dist:'227,9 млн км от Солнца',
    color:0xB5502D, colorCss:'#B5502D',
    axialTilt:25.2, rotDur:22,
    paragraphs:[
      'Вулкан Олимп поднимается на 21,9 км — почти втрое выше Эвереста, а каньон Маринер пересёк бы США из конца в конец.',
      'Ржавый цвет — это буквально ржавчина: оксиды железа покрывают планету тонким слоем пыли.',
      'Первым Марс сфотографировал «Маринер-4» в 1965 году — всего 21 нечёткий кадр. Сегодня по его поверхности одновременно колесят несколько роверов, включая Curiosity и Perseverance.'
    ],
    stats:[['Диаметр','6 779 км'],['От Солнца','227,9 млн км'],['Сутки','24ч 37м'],['Атмосфера','95% CO₂, разреженная'],['Спутники','Фобос, Деймос'],['Первый пролёт','Маринер-4, 1965']],
    textureKey:'texture_mars',
    hasRings:false,
    hotspots:[
      {id:'olympus', label:'Гора Олимп', lat:18.65, lon:-133.8, imageKey:'hotspot_mars_olympus',
        caption:'Щитовой вулкан высотой 21,9 км — крупнейшая известная гора Солнечной системы.'},
      {id:'valles', label:'Долины Маринер', lat:-14, lon:-59.2, imageKey:'hotspot_mars_valles',
        caption:'Каньон длиной свыше 4000 км и глубиной до 7 км — пересёк бы США из конца в конец.'},
      {id:'surface', label:'Поверхность', lat:-5.4, lon:137.8, imageKey:'hotspot_mars_surface',
        caption:'Вид с грунта, каким его фиксируют марсоходы: камни, пыль и ржавый горизонт.'}
    ]
  },
  {
    id:'jupiter', order:5, kind:'gas', name:'ЮПИТЕР',
    epithet:'Планета, которая почти стала звездой',
    dist:'778,5 млн км от Солнца',
    color:0xC88B4A, colorCss:'#C88B4A',
    axialTilt:3.13, rotDur:9,
    paragraphs:[
      'Юпитер тяжелее всех остальных планет системы вместе взятых, помноженных на два с половиной.',
      'Большое Красное Пятно — ураган шире Земли, бушующий, по разным оценкам, уже несколько столетий подряд.',
      'Четыре крупнейших спутника — Ио, Европу, Ганимед и Каллисто — открыл Галилей ещё в 1610 году. Ганимед крупнее Меркурия и остаётся самым большим спутником Солнечной системы.'
    ],
    stats:[['Диаметр','139 820 км'],['От Солнца','778,5 млн км'],['Сутки','9ч 56м'],['Крупные спутники','Ио, Европа, Ганимед, Каллисто'],['Всего спутников','90+'],['Первый исследователь','Пионер-10, 1973']],
    textureKey:'texture_jupiter',
    hasRings:false,
    hotspots:[
      {id:'grs', label:'Большое Красное Пятно', lat:-22, lon:-90, imageKey:'hotspot_jupiter_grs',
        caption:'Атмосферный вихрь шириной больше Земли, известный астрономам уже несколько столетий.'},
      {id:'bands', label:'Облачные полосы', lat:10, lon:30, imageKey:'hotspot_jupiter_bands',
        caption:'Потоки аммиачных облаков, движущиеся в противоположных направлениях со скоростью сотен км/ч.'}
    ]
  },
  {
    id:'saturn', order:6, kind:'gas', name:'САТУРН',
    epithet:'Единственная планета легче воды',
    dist:'1,43 млрд км от Солнца',
    color:0xD9C08A, colorCss:'#D9C08A',
    axialTilt:26.7, rotDur:10,
    paragraphs:[
      'Плотность Сатурна ниже водной: найдись океан подходящего размера, планета в нём не утонула бы.',
      'Кольца сложены изо льда и камня — от пылинок до глыб размером с дом, а в толщину редко превышают сто метров.',
      'Зонд Cassini провёл на орбите Сатурна 13 лет и в конце миссии сгорел в его атмосфере — чтобы случайно не занести земные микробы на спутники, потенциально пригодные для жизни.'
    ],
    stats:[['Диаметр','116 460 км'],['От Солнца','1,43 млрд км'],['Год','29,4 года'],['Крупнейший спутник','Титан — больше Меркурия'],['Всего спутников','140+'],['Исследован','Cassini-Huygens, 2004–2017']],
    textureKey:'texture_saturn',
    hasRings:true,
    hotspots:[
      {id:'hexagon', label:'Северный шестиугольник', lat:80, lon:0, imageKey:'hotspot_saturn_hexagon',
        caption:'Устойчивый шестиугольный атмосферный вихрь над северным полюсом, шириной больше Земли.'},
      {id:'rings_closeup', label:'Кольца вблизи', lat:0, lon:0, isRing:true, imageKey:'hotspot_saturn_rings_closeup',
        caption:'Не сплошной диск, а мириады отдельных ледяных и каменных частиц — от пылинок до глыб.'}
    ]
  },
  {
    id:'uranus', order:7, kind:'gas', name:'УРАН',
    epithet:'Катится по орбите на боку',
    dist:'2,87 млрд км от Солнца',
    color:0x8FD8D0, colorCss:'#8FD8D0',
    axialTilt:82, rotDur:15,
    paragraphs:[
      'Ось наклонена почти на 98° — вероятно, след древнего столкновения с телом размером с Землю.',
      'Бледно-голубой цвет планете придаёт метан в атмосфере, поглощающий красный свет.',
      'Уран стал первой планетой, открытой в телескоп, а не видимой невооружённым глазом, — Уильям Гершель заметил её в 1781 году. Рядом пролетал только один аппарат, «Вояджер-2», в 1986 году.'
    ],
    stats:[['Диаметр','50 724 км'],['От Солнца','2,87 млрд км'],['Наклон оси','97,8°'],['Спутники','27, названы в честь героев Шекспира'],['Открыт','У. Гершелем, 1781'],['Посещён','Вояджер-2, 1986']],
    textureKey:'texture_uranus',
    hasRings:false,
    hotspots:[
      {id:'rings', label:'Кольца Урана', lat:0, lon:0, imageKey:'hotspot_uranus_rings',
        caption:'Обнаружены только в 1977 году — на приборах их выдало мерцание звёзд, проходящее сквозь них.'},
      {id:'feature', label:'Атмосферное течение', lat:-30, lon:100, imageKey:'hotspot_uranus_feature',
        caption:'Уран — одна из самых малоизученных планет крупным планом: его посещал только «Вояджер-2», в 1986 году.'}
    ]
  },
  {
    id:'neptune', order:8, kind:'gas', name:'НЕПТУН',
    epithet:'Последняя остановка — и самая ветреная',
    dist:'4,5 млрд км от Солнца',
    color:0x3B5FCB, colorCss:'#3B5FCB',
    axialTilt:28.3, rotDur:12,
    paragraphs:[
      'Свет от Солнца добирается сюда больше четырёх часов, но именно здесь дуют самые быстрые ветра системы — до 2100 км/ч.',
      'Нептун вычислили на бумаге раньше, чем увидели в телескоп: его положение выдали возмущения орбиты Урана.',
      'Единственный аппарат, побывавший у Нептуна, — «Вояджер-2», пролетевший мимо в 1989 году, в самом конце своего большого путешествия по планетам. Следующий визит человечества пока не запланирован.'
    ],
    stats:[['Диаметр','49 244 км'],['От Солнца','4,5 млрд км'],['Год','165 лет'],['Ветра','до 2100 км/ч'],['Спутники','16, крупнейший — Тритон'],['Посещён','Вояджер-2, 1989']],
    textureKey:'texture_neptune',
    hasRings:false,
    hotspots:[
      {id:'dark_spot', label:'Большое тёмное пятно', lat:-22, lon:-40, imageKey:'hotspot_neptune_dark_spot',
        caption:'Гигантский шторм, замеченный «Вояджером-2» в 1989 году и с тех пор исчезнувший.'},
      {id:'clouds', label:'Метановые облака', lat:30, lon:60, imageKey:'hotspot_neptune_clouds',
        caption:'Полосы перистых облаков, гонимые самыми быстрыми ветрами Солнечной системы.'}
    ]
  }
];
