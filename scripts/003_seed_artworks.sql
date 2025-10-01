-- Insert sample artworks
INSERT INTO artworks (
  title, 
  artist, 
  category_id, 
  year, 
  origin, 
  image_url, 
  qr_code,
  description_fr,
  description_en,
  description_wo,
  audio_url_fr,
  audio_url_en,
  audio_url_wo
)
SELECT
  'Masque Dogon',
  'Artisan Dogon',
  (SELECT id FROM categories WHERE slug = 'masques'),
  1950,
  'Mali',
  '/masque-africain-dogon-bois-sculpt-.jpg',
  'MCN-001',
  'Ce masque Dogon en bois sculpté représente un esprit ancestral. Les Dogons du Mali utilisent ces masques lors de cérémonies funéraires et de rituels agricoles. Les motifs géométriques symbolisent la connexion entre le monde terrestre et spirituel.',
  'This carved wooden Dogon mask represents an ancestral spirit. The Dogon people of Mali use these masks during funeral ceremonies and agricultural rituals. The geometric patterns symbolize the connection between the earthly and spiritual worlds.',
  'Bii masque Dogon bu ñu def ci bant bi dafa mel ni jikko bu mag. Dogon yi ci Mali dañuy jëfandikoo ci sérémonies yu nekk ci tocc ak rituel yu agriculture. Motif yi géométrique dañuy wone lëkkalekaay bu nekk ci àdduna ak suuf.',
  '/audio/masque-dogon-fr.mp3',
  '/audio/masque-dogon-en.mp3',
  '/audio/masque-dogon-wo.mp3'
WHERE NOT EXISTS (SELECT 1 FROM artworks WHERE qr_code = 'MCN-001');

INSERT INTO artworks (
  title, 
  artist, 
  category_id, 
  year, 
  origin, 
  image_url, 
  qr_code,
  description_fr,
  description_en,
  description_wo,
  audio_url_fr,
  audio_url_en,
  audio_url_wo
)
SELECT
  'Statue Nok',
  'Culture Nok',
  (SELECT id FROM categories WHERE slug = 'sculptures'),
  500,
  'Nigeria',
  '/statue-nok-terracotta-nigeria-ancienne.jpg',
  'MCN-002',
  'Cette statue en terre cuite appartient à la culture Nok, l''une des plus anciennes civilisations d''Afrique subsaharienne. Datant de 500 avant J.-C., elle témoigne de la maîtrise artistique exceptionnelle de ce peuple du Nigeria.',
  'This terracotta statue belongs to the Nok culture, one of the oldest civilizations in sub-Saharan Africa. Dating from 500 BC, it testifies to the exceptional artistic mastery of this Nigerian people.',
  'Bii statue bu def ci tëdd bi dafa bokk ci culture Nok, benn ci civilisation yi gën a mag ci Afrique subsaharienne. Bu nekk ci 500 avant J.-C., dafa wone ni ñu xam art bu mag ci nit ñi ci Nigeria.',
  '/audio/statue-nok-fr.mp3',
  '/audio/statue-nok-en.mp3',
  '/audio/statue-nok-wo.mp3'
WHERE NOT EXISTS (SELECT 1 FROM artworks WHERE qr_code = 'MCN-002');

INSERT INTO artworks (
  title, 
  artist, 
  category_id, 
  year, 
  origin, 
  image_url, 
  qr_code,
  description_fr,
  description_en,
  description_wo,
  audio_url_fr,
  audio_url_en,
  audio_url_wo
)
SELECT
  'Tissu Kente',
  'Tisserands Ashanti',
  (SELECT id FROM categories WHERE slug = 'textiles'),
  1980,
  'Ghana',
  '/tissu-kente-ghana-color--motifs-g-om-triques.jpg',
  'MCN-003',
  'Le Kente est un tissu traditionnel ghanéen tissé à la main par le peuple Ashanti. Chaque couleur et motif a une signification symbolique. Historiquement réservé à la royauté, il est aujourd''hui porté lors d''occasions spéciales.',
  'Kente is a traditional Ghanaian fabric hand-woven by the Ashanti people. Each color and pattern has symbolic meaning. Historically reserved for royalty, it is now worn on special occasions.',
  'Kente dafa mel ni dëkk bu tradisyonel bu Ghana bu ñu def ci loxo ci Ashanti. Benn kouleur ak motif am na téere bu am solo. Ci njëkk bi, dafa nekk ci boroom yi rekk, waaye léegi dañuy samp ko ci xew yu mag.',
  '/audio/tissu-kente-fr.mp3',
  '/audio/tissu-kente-en.mp3',
  '/audio/tissu-kente-wo.mp3'
WHERE NOT EXISTS (SELECT 1 FROM artworks WHERE qr_code = 'MCN-003');

INSERT INTO artworks (
  title, 
  artist, 
  category_id, 
  year, 
  origin, 
  image_url, 
  qr_code,
  description_fr,
  description_en,
  description_wo,
  audio_url_fr,
  audio_url_en,
  audio_url_wo
)
SELECT
  'Tête d''Ifè',
  'Artistes Yoruba',
  (SELECT id FROM categories WHERE slug = 'sculptures'),
  1300,
  'Nigeria',
  '/t-te-if--bronze-nigeria-r-aliste.jpg',
  'MCN-004',
  'Cette tête en bronze d''Ifè est un chef-d''œuvre de l''art Yoruba du Nigeria. Datant du 12ème siècle, elle démontre une maîtrise technique remarquable de la fonte à la cire perdue et un réalisme saisissant.',
  'This bronze head from Ife is a masterpiece of Yoruba art from Nigeria. Dating from the 12th century, it demonstrates remarkable technical mastery of lost-wax casting and striking realism.',
  'Bii bopp bu bronze bu Ifè dafa mel ni liggéey bu mag bu art Yoruba ci Nigeria. Bu nekk ci 12ème siècle, dafa wone ni ñu xam technique bu mag ci fonte à la cire perdue ak réalisme bu rafet.',
  '/audio/tete-ife-fr.mp3',
  '/audio/tete-ife-en.mp3',
  '/audio/tete-ife-wo.mp3'
WHERE NOT EXISTS (SELECT 1 FROM artworks WHERE qr_code = 'MCN-004');
