export type Category = 'Residencial' | 'Vacacional' | 'Oficinas' | 'Hotel' | 'Wellness';
export type Status = 'TERMINADO' | 'PREVENTA' | 'EN OBRA' | 'DISPONIBLE';

export interface Property {
  id: string;
  slug: string;
  name: string;
  category: Category;
  zone: string;
  city: string;
  status: Status;
  // Headline metric — number of units, lots, oficinas, suites, etc.
  units: { count: number; noun: string };
  areaRange: { from: number; to: number };
  architect?: string;
  yearBuilt?: number;
  description: string[];
  features: string[];
  image: string;
  gallery: { src: string; alt: string }[];
  alt: string;
  coordinates?: string;
  featured?: boolean;
  invitation?: string;
  // Optional Gaussian-splatting capture rendered by Spark (Niantic SPZ format).
  model?: {
    src: string;          // absolute URL/path served by /public (e.g. /models/tour.spz)
    fileName: string;     // Spark uses the extension to pick the decoder
    label: string;        // section eyebrow — e.g. "Recorrido 3D"
    title: string;        // section H2
    caption: string;      // one-line description above the viewer
    byteSize: number;     // for the "5.3 MB" hint on the load CTA
  };
}

// AV Group hot-links from their Shopify CDN. Replace with own CDN once licensed.
const av = (file: string) => `https://avgrouprojects.com/cdn/shop/files/${file}`;

export const properties: Property[] = [
  {
    id: 'selvavignon',
    slug: 'selvavignon',
    name: 'Selvavignon',
    category: 'Residencial',
    zone: 'San Lucas, El Poblado',
    city: 'Medellín',
    status: 'DISPONIBLE',
    units: { count: 24, noun: 'apartamentos duplex' },
    areaRange: { from: 262, to: 510 },
    architect: 'ML Arquitectos',
    description: [
      'Proyecto asociativo en San Lucas, El Poblado, pensado para quienes desean estar en la ciudad sin renunciar a un hábitat donde los pájaros, el agua y el verde se convierten en la parte principal del hogar.',
      'Veinticuatro apartamentos duplex distribuidos en una sola torre, con áreas que van entre 262 m² y 510 m² y alturas piso a techo de tres metros. Diseño firmado por ML Arquitectos.',
    ],
    features: [
      'Apartamentos duplex',
      'Alturas piso a techo de 3 metros',
      'Piscina techada',
      'Gimnasio',
      'Entorno privado y exclusivo',
      'Vista a zona verde protegida',
      'Diseño ML Arquitectos',
      'Acabados premium personalizables',
    ],
    image: av('Exterior2_1.jpg'),
    gallery: [
      { src: av('Terraza_B_1.jpg'), alt: 'Terraza principal Selvavignon' },
      { src: av('exterior_1_1.jpg'), alt: 'Fachada exterior' },
      { src: av('Cocina_B_1.jpg'), alt: 'Cocina con isla' },
      { src: av('habitacion_c.jpg'), alt: 'Suite principal' },
    ],
    alt: 'Selvavignon — fachada residencial en San Lucas, El Poblado',
    coordinates: '6.1956° N · 75.5524° W',
    featured: true,
    invitation: 'Solicitar visita guiada',
    model: {
      src: '/models/tour.spz',
      fileName: 'tour.spz',
      label: '◆ RECORRIDO 3D',
      title: 'Camina la residencia\nantes de visitarla.',
      caption:
        'Captura volumétrica de una de las unidades muestra. Arrastra para orbitar, usa W·A·S·D para caminar.',
      byteSize: 3_710_483,
    },
  },
  {
    id: 'altozza',
    slug: 'altozza',
    name: 'Altozza',
    category: 'Residencial',
    zone: 'Avenida El Poblado',
    city: 'Medellín',
    status: 'PREVENTA',
    units: { count: 95, noun: 'apartamentos · 105 oficinas' },
    areaRange: { from: 57, to: 610 },
    description: [
      'Altozza es sinónimo de vivir en la cúspide de la exclusividad y el refinamiento. Concebido como un refugio de lujo y estilo en el corazón urbano de El Poblado.',
      'Una torre que combina noventa y cinco apartamentos (57–129 m²) y ciento cinco oficinas (35–610 m²) en un único hito vertical. Atrae a quienes buscan una vida en equilibrio y a la altura de sus aspiraciones más elevadas.',
    ],
    features: [
      '95 apartamentos · 105 oficinas',
      'Torre vertical mixed-use',
      'Vistas panorámicas sobre El Poblado',
      'Lobby de doble altura',
      'Acceso controlado por biometría',
      'Zona comercial en piso bajo',
      'Conectividad estructurada',
      'Estacionamiento subterráneo',
    ],
    image: av('Vista_Atardecer_1.1_copia.png'),
    gallery: [
      { src: av('Vista_03.png'), alt: 'Vista nocturna Altozza' },
      { src: av('Vista_06.png'), alt: 'Render diurno' },
      { src: av('Vista_04.png'), alt: 'Detalle de fachada' },
      { src: av('Vista_Isometrica_2.png'), alt: 'Isometría del proyecto' },
    ],
    alt: 'Altozza — torre vertical en Avenida El Poblado',
    coordinates: '6.2042° N · 75.5680° W',
    featured: true,
    invitation: 'Reservar en preventa',
  },
  {
    id: 'wake',
    slug: 'wake',
    name: 'Wake',
    category: 'Vacacional',
    zone: 'Nuevo Provenza, El Poblado',
    city: 'Medellín',
    status: 'TERMINADO',
    units: { count: 45, noun: 'apartamentos' },
    areaRange: { from: 65, to: 420 },
    description: [
      'Una nueva manera de vivir, habitar y hacer las cosas. Un nuevo todo en medio de lo de siempre. Wake es una república independiente.',
      'Cuarenta y cinco apartamentos en una sola torre, con áreas entre 65 m² y 420 m², ubicada en Nuevo Provenza —el sector más vibrante de El Poblado. Operación de rentas cortas con curaduría Pento.',
    ],
    features: [
      'Operación de rentas cortas activa',
      'Cuarenta y cinco apartamentos',
      'Áreas desde 65 m² hasta 420 m²',
      'Ubicación en Nuevo Provenza',
      'Lobby con concierge',
      'Rooftop con vista a la ciudad',
      'Co-working en planta común',
      'Servicio de housekeeping',
    ],
    image: av('IMG_1526.jpg'),
    gallery: [
      { src: av('IMG_1525.jpg'), alt: 'Lobby de Wake' },
      { src: av('Foto.8.jpg'), alt: 'Apartamento muestra' },
      { src: av('Foto.17.jpg'), alt: 'Cocina contemporánea' },
      { src: av('Foto.25.jpg'), alt: 'Terraza con vista' },
    ],
    alt: 'Wake — torre de rentas cortas en Nuevo Provenza',
    coordinates: '6.2078° N · 75.5712° W',
    featured: true,
    invitation: 'Consultar disponibilidad de inversión',
  },
  {
    id: 'hive-bluum',
    slug: 'hive-bluum',
    name: 'Hive Bluum',
    category: 'Oficinas',
    zone: 'Astorga, Milla de Oro',
    city: 'Medellín',
    status: 'PREVENTA',
    units: { count: 60, noun: 'oficinas' },
    areaRange: { from: 39, to: 1200 },
    description: [
      'En el corazón de Medellín, presentamos un nuevo ícono de sostenibilidad y colaboración. Hive Bluum redefine la oficina contemporánea sobre la Milla de Oro.',
      'Sesenta oficinas con áreas que parten desde 39 m² hasta 1.200 m², en una torre LEED-aspirante con escena gastronómica de primer nivel a sus pies. Alto retorno de inversión por demanda constante en la zona.',
    ],
    features: [
      'Torre certificación LEED en proceso',
      'Sesenta oficinas modulares',
      'Áreas desde 39 m² hasta 1.200 m²',
      'Lobby gastronómico planta baja',
      'Sky-lobby para eventos corporativos',
      'Acceso a Milla de Oro',
      'Bicicleteros y vestieres',
      'Sistema HVAC con sensores CO₂',
    ],
    image: av('Astorga_IMG02_1.jpg'),
    gallery: [
      { src: av('Astorga_IMG03_1.jpg'), alt: 'Hive Bluum render exterior' },
      { src: av('Astorga_IMG03_1_fa420fa4-881c-4101-9dd4-8d81d31ffc88.jpg'), alt: 'Detalle arquitectónico' },
      { src: av('IMG_1525.jpg'), alt: 'Espacio interior tipo' },
      { src: av('IMG_1523.jpg'), alt: 'Vista de oficina con luz natural' },
    ],
    alt: 'Hive Bluum — torre de oficinas en Astorga, Milla de Oro',
    coordinates: '6.2032° N · 75.5677° W',
    featured: true,
    invitation: 'Solicitar plano de oficinas',
  },
  {
    id: 'nuv',
    slug: 'nuv',
    name: 'NUV',
    category: 'Residencial',
    zone: 'Alto de las Palmas',
    city: 'Envigado',
    status: 'PREVENTA',
    units: { count: 0, noun: 'duplex y simplex desde 110 m²' },
    areaRange: { from: 110, to: 320 },
    architect: 'Medianero',
    description: [
      'NUV representa un oasis de serenidad, donde la mente puede descansar y rejuvenecer. Parte del ecosistema Alto 5 Minute City sobre el Alto de las Palmas.',
      'Apartamentos duplex y simplex desde 110 m², entregados en obra gris para personalización completa. Vecindario integrado: zonas comerciales, espacios de trabajo, salud, gastronomía, arte y áreas verdes.',
    ],
    features: [
      'Entrega en obra gris',
      'Duplex y simplex',
      'Ecosistema Alto 5 Minute City',
      'Áreas desde 110 m²',
      'Espacios de trabajo integrados',
      'Servicios de salud cercanos',
      'Hoteles y restaurantes',
      'Diseño firma Medianero',
    ],
    image: av('PHOTO-2024-01-24-09-21-10.jpg'),
    gallery: [
      { src: av('10_2.png'), alt: 'NUV render aéreo' },
      { src: av('9.png'), alt: 'Render diurno' },
      { src: av('8.png'), alt: 'Render con paisaje' },
      { src: av('11.png'), alt: 'Detalle de fachada' },
    ],
    alt: 'NUV — apartamentos en Alto de las Palmas, Envigado',
    coordinates: '6.1730° N · 75.5430° W',
    invitation: 'Conocer planos en preventa',
  },
  {
    id: 'herbazal',
    slug: 'herbazal',
    name: 'Herbazal',
    category: 'Residencial',
    zone: 'Loma del Tesoro, El Poblado',
    city: 'Medellín',
    status: 'TERMINADO',
    units: { count: 14, noun: 'apartamentos' },
    areaRange: { from: 288, to: 480 },
    architect: 'Andrés Aristizabal',
    yearBuilt: 2021,
    description: [
      'Residencial de lujo entregado en 2021 sobre la Loma del Tesoro, a pasos de la Clínica del Rosario. Un proyecto cien por ciento exitoso diseñado por el arquitecto Andrés Aristizabal.',
      'Catorce apartamentos en una torre con dos lofts en planta baja, apartamentos típicos en niveles intermedios y dos penthouses con dobles alturas y vistas francas hacia Medellín. Entrega en obra gris para máxima personalización.',
    ],
    features: [
      'Catorce apartamentos en torre única',
      'Dos lofts en planta baja',
      'Dos penthouses con doble altura',
      'Piscina semi-olímpica techada',
      'Lobby con doble altura',
      'Áreas internas generosas',
      'Terrazas amplias',
      'Diseño Andrés Aristizabal',
    ],
    image: av('Foto.23.jpg'),
    gallery: [
      { src: av('Herbazal_9902_9.jpg'), alt: 'Herbazal exterior' },
      { src: av('5.jpg'), alt: 'Penthouse con doble altura' },
      { src: av('30.jpg'), alt: 'Detalle de cocina' },
      { src: av('21.jpg'), alt: 'Suite principal' },
    ],
    alt: 'Herbazal — residencial en Loma del Tesoro, El Poblado',
    coordinates: '6.1968° N · 75.5650° W',
    invitation: 'Visitar apartamento muestra',
    model: {
      src: '/models/Chair.spz',
      fileName: 'Chair.spz',
      label: '◆ DETALLE CURADO',
      title: 'Cada pieza,\nuna decisión.',
      caption:
        'Selección del mobiliario de autor escogido para los espacios sociales. Captura volumétrica inspeccionable.',
      byteSize: 5_512_008,
    },
  },
  {
    id: 'cantero',
    slug: 'cantero',
    name: 'Cantero',
    category: 'Residencial',
    zone: 'El Campestre',
    city: 'Medellín',
    status: 'TERMINADO',
    units: { count: 8, noun: 'apartamentos' },
    areaRange: { from: 207, to: 478 },
    architect: 'Juan Camilo Llano',
    yearBuilt: 2021,
    description: [
      'Proyecto asociativo al costo, diseñado por el arquitecto Juan Camilo Llano y entregado en 2021. Las curvas en fachada se proponen como elemento de diseño innovador y cada vez más relevante.',
      'Ocho apartamentos en una torre construida con ladrillo claro, estructura metálica, madera y vidrio. Áreas entre 207 m² y 478 m² en el sector consolidado de El Campestre.',
    ],
    features: [
      'Ocho apartamentos exclusivos',
      'Curvas en fachada',
      'Ladrillo claro + estructura metálica',
      'Áreas entre 207 m² y 478 m²',
      'Diseño Juan Camilo Llano',
      'Entregado en 2021',
      'Sector El Campestre',
      'Terminados premium',
    ],
    image: av('SM_3.jpg'),
    gallery: [
      { src: av('Foto.34.jpg'), alt: 'Cantero fachada curva' },
      { src: av('Foto.11.jpg'), alt: 'Espacio interior' },
      { src: av('Foto.13.jpg'), alt: 'Detalle de materiales' },
      { src: av('Foto.34_b8596371-7700-4303-8aa9-c26e4c919343.jpg'), alt: 'Vista exterior nocturna' },
    ],
    alt: 'Cantero — apartamentos en El Campestre',
    coordinates: '6.1840° N · 75.5860° W',
    invitation: 'Coordinar tour por la unidad disponible',
  },
  {
    id: 'forever-young',
    slug: 'forever-young',
    name: 'Forever Young',
    category: 'Wellness',
    zone: 'El Poblado',
    city: 'Medellín',
    status: 'PREVENTA',
    units: { count: 5, noun: 'componentes integrados' },
    areaRange: { from: 35, to: 1200 },
    description: [
      'Un refugio donde la naturaleza y la modernidad se fusionan para ofrecer una experiencia de bienestar integral en el corazón de El Poblado.',
      'Cada detalle está diseñado para que reconectes con tu esencia más pura, brindando un oasis de calma y equilibrio en medio de la vida urbana. Un complejo que reúne hotel, spa, gastronomía, oficinas y servicios médicos especializados.',
    ],
    features: [
      'Hotel boutique',
      'Spa de día',
      'Centro médico wellness',
      'Gastronomía curada',
      'Locales comerciales seleccionados',
      'Oficinas en altura',
      'Senderos de meditación',
      'Programa de medicina preventiva',
    ],
    image: av('PHOTO-2025-02-19-11-18-57_2.jpg'),
    gallery: [
      { src: av('Vista_03.png'), alt: 'Forever Young render exterior' },
      { src: av('Vista_06.png'), alt: 'Vista del spa' },
      { src: av('PHOTO-2024-01-24-09-21-10.jpg'), alt: 'Zonas comunes' },
      { src: av('IMG_1526.jpg'), alt: 'Suites del hotel' },
    ],
    alt: 'Forever Young — complejo wellness en El Poblado',
    coordinates: '6.2086° N · 75.5695° W',
    featured: true,
    invitation: 'Reservar reunión privada',
  },
];

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function getRelatedProperties(slug: string, count = 3): Property[] {
  return properties.filter((p) => p.slug !== slug).slice(0, count);
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured);
}
