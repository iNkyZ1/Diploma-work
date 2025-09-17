const roomsData = [
	// Стандарт
	{
		id: 1,
		category: 'standard',
		name: 'Стандарт (№201)',
		price: 4500,
		floor: 2,
		description:
			'Уютный номер с видом на лес. Площадь 20 м², двуспальная кровать или две односпальные.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ'],
		image: '/images/rooms/room1.jpg',
	},
	{
		id: 2,
		category: 'standard',
		name: 'Стандарт (№202)',
		price: 4500,
		floor: 2,
		description:
			'Уютный номер с видом на озеро. Площадь 20 м², двуспальная кровать или две односпальные.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ'],
		image: '/images/rooms/room1.jpg',
	},
	{
		id: 3,
		category: 'standard',
		name: 'Стандарт (№203)',
		price: 4500,
		floor: 2,
		description:
			'Уютный номер с видом на лес. Площадь 20 м², двуспальная кровать или две односпальные.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ'],
		image: '/images/rooms/room1.jpg',
	},
	{
		id: 4,
		category: 'standard',
		name: 'Стандарт (№204)',
		price: 4500,
		floor: 2,
		description:
			'Уютный номер с видом на озеро. Площадь 20 м², двуспальная кровать или две односпальные.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ'],
		image: '/images/rooms/room1.jpg',
	},
	{
		id: 5,
		category: 'standard',
		name: 'Стандарт (№205)',
		price: 4500,
		floor: 2,
		description:
			'Уютный номер с видом на лес. Площадь 20 м², двуспальная кровать или две односпальные.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ'],
		image: '/images/rooms/room1.jpg',
	},
	{
		id: 6,
		category: 'standard',
		name: 'Стандарт (№206)',
		price: 4500,
		floor: 2,
		description:
			'Уютный номер с видом на озеро. Площадь 20 м², двуспальная кровать или две односпальные.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ'],
		image: '/images/rooms/room1.jpg',
	},
	{
		id: 7,
		category: 'standard',
		name: 'Стандарт (№207)',
		price: 4500,
		floor: 2,
		description:
			'Уютный номер с видом на лес. Площадь 20 м², двуспальная кровать или две односпальные.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ'],
		image: '/images/rooms/room1.jpg',
	},
	{
		id: 8,
		category: 'standard',
		name: 'Стандарт (№208)',
		price: 4500,
		floor: 2,
		description:
			'Уютный номер с видом на озеро. Площадь 20 м², двуспальная кровать или две односпальные.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ'],
		image: '/images/rooms/room1.jpg',
	},
	// Комфорт
	{
		id: 9,
		category: 'comfort',
		name: 'Комфорт (№301)',
		price: 7000,
		floor: 3,
		description:
			'Просторный номер с видом на лес. Площадь 27 м², двуспальная кровать, мини-бар.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ', 'Мини-бар', 'Кондиционер'],
		image: '/images/rooms/room2.jpg',
	},
	{
		id: 10,
		category: 'comfort',
		name: 'Комфорт (№302)',
		price: 7000,
		floor: 3,
		description:
			'Просторный номер с видом на озеро. Площадь 27 м², двуспальная кровать, мини-бар.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ', 'Мини-бар', 'Кондиционер'],
		image: '/images/rooms/room2.jpg',
	},
	{
		id: 11,
		category: 'comfort',
		name: 'Комфорт (№303)',
		price: 7000,
		floor: 3,
		description:
			'Просторный номер с видом на лес. Площадь 27 м², двуспальная кровать, мини-бар.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ', 'Мини-бар', 'Кондиционер'],
		image: '/images/rooms/room2.jpg',
	},
	{
		id: 12,
		category: 'comfort',
		name: 'Комфорт (№304)',
		price: 7000,
		floor: 3,
		description:
			'Просторный номер с видом на озеро. Площадь 27 м², двуспальная кровать, мини-бар.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ', 'Мини-бар', 'Кондиционер'],
		image: '/images/rooms/room2.jpg',
	},
	{
		id: 13,
		category: 'comfort',
		name: 'Комфорт (№305)',
		price: 7000,
		floor: 3,
		description:
			'Просторный номер с видом на лес. Площадь 27 м², двуспальная кровать, мини-бар.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ', 'Мини-бар', 'Кондиционер'],
		image: '/images/rooms/room2.jpg',
	},
	{
		id: 14,
		category: 'comfort',
		name: 'Комфорт (№306)',
		price: 7000,
		floor: 3,
		description:
			'Просторный номер с видом на озеро. Площадь 27 м², двуспальная кровать, мини-бар.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ', 'Мини-бар', 'Кондиционер'],
		image: '/images/rooms/room2.jpg',
	},
	{
		id: 15,
		category: 'comfort',
		name: 'Комфорт (№307)',
		price: 7000,
		floor: 3,
		description:
			'Просторный номер с видом на лес. Площадь 27 м², двуспальная кровать, мини-бар.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ', 'Мини-бар', 'Кондиционер'],
		image: '/images/rooms/room2.jpg',
	},
	{
		id: 16,
		category: 'comfort',
		name: 'Комфорт (№308)',
		price: 7000,
		floor: 3,
		description:
			'Просторный номер с видом на озеро. Площадь 27 м², двуспальная кровать, мини-бар.',
		amenities: ['Wi-Fi', 'Телевизор', 'Чайник', 'Душ', 'Мини-бар', 'Кондиционер'],
		image: '/images/rooms/room2.jpg',
	},
	// Люкс
	{
		id: 17,
		category: 'luxury',
		name: 'Люкс (№401)',
		price: 12000,
		floor: 4,
		description:
			'Роскошный номер с панорамным видом на лес. Площадь 40 м², гостиная зона, ванна с гидромассажем.',
		amenities: [
			'Wi-Fi',
			'Домашний кинотеатр',
			'Кофемашина',
			'Мини-бар',
			'Мини-холодильник',
			'Кондиционер',
			'Комплект халатов и тапочек',
		],
		image: '/images/rooms/room3.jpg',
	},
	{
		id: 18,
		category: 'luxury',
		name: 'Люкс (№402)',
		price: 12000,
		floor: 4,
		description:
			'Роскошный номер с панорамным видом на Байкал. Площадь 40 м², гостиная зона, ванна с гидромассажем.',
		amenities: [
			'Wi-Fi',
			'Домашний кинотеатр',
			'Кофемашина',
			'Мини-бар',
			'Мини-холодильник',
			'Кондиционер',
			'Комплект халатов и тапочек',
		],
		image: '/images/rooms/room3.jpg',
	},
	{
		id: 19,
		category: 'luxury',
		name: 'Люкс (№403)',
		price: 12000,
		floor: 4,
		description:
			'Роскошный номер с панорамным видом на лес. Площадь 40 м², гостиная зона, ванна с гидромассажем.',
		amenities: [
			'Wi-Fi',
			'Домашний кинотеатр',
			'Кофемашина',
			'Мини-бар',
			'Мини-холодильник',
			'Кондиционер',
			'Комплект халатов и тапочек',
		],
		image: '/images/rooms/room3.jpg',
	},
	{
		id: 20,
		category: 'luxury',
		name: 'Люкс (№404)',
		price: 12000,
		floor: 4,
		description:
			'Роскошный номер с панорамным видом на Байкал. Площадь 40 м², гостиная зона, ванна с гидромассажем.',
		amenities: [
			'Wi-Fi',
			'Домашний кинотеатр',
			'Кофемашина',
			'Мини-бар',
			'Мини-холодильник',
			'Кондиционер',
			'Комплект халатов и тапочек',
		],
		image: '/images/rooms/room3.jpg',
	},
];

export default roomsData;
