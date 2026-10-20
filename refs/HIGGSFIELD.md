# Higgsfield для сайта: что генерировать и куда это встаёт

Прямого подключения нет: в каталоге коннекторов Claude нет Higgsfield, а сеть облачной сессии закрыта для его API. Схема работы: вы генерируете в Higgsfield по промтам ниже → кладёте файлы в чат или в `public/media/raw/` → я режу, сжимаю (AVIF / AV1 + H.264) и встраиваю.

Правило «без ИИ-слопа»: не генерируем людей, офисы, клиентов и «сцены работы», которых не было. Только (1) улучшение ваших реальных фото и скриншотов и (2) абстрактный материал в цветах бренда.

Палитра для всех промтов: белый `#FFFFFF`, светло-серый `#F1F3F8`, почти чёрный `#0B1020`, синий `#2464FB`. Без фиолетового, без градиентов-радуг, без неона.

## 1. Портрет для «Обо мне» — приоритет 1

Вход: ваше реальное фото (лицо хорошо видно, нейтральный фон).
Режим: улучшение / relight вашего фото, не генерация нового человека.

```
Studio portrait relight of the same person, keep face and identity exactly as in the input photo.
Clean white seamless background, soft key light from the left, subtle cool blue rim light (#2464FB) on the right edge.
Dark navy clothing (#0B1020). Calm confident expression, looking at camera. Editorial, sharp, natural skin texture,
no beauty filter, no retouched plastic skin. Vertical 4:5, 2400x3000.
```

## 2. Ролик «до → после» для автоматизации — приоритет 2

Нужен как фон для скролл-сцены на `/services/automation`: прокрутка проигрывает ролик кадр за кадром.
Режим: text-to-video, 6–8 секунд, без звука, 16:9 и отдельно 9:16 для телефона.

```
Minimal abstract 3D scene on a pure white background. Left: a messy pile of flat paper sheets and chat bubbles
in light grey (#F1F3F8) and navy (#0B1020), slightly chaotic. Camera slowly dollies right; the sheets lift, align
into a clean row of rounded rectangular nodes connected by thin lines, and a single glowing blue dot (#2464FB)
travels along the line from node to node. Soft studio light, gentle shadows, no text, no people, no logos.
Smooth continuous motion, ends on the clean ordered state. 8 seconds.
```

## 3. Видео для соцсетей к запуску — приоритет 3

Вход: скриншоты сайта и демо (я пришлю: бот, кофейня, главная с монограммой).
Режим: image-to-video, мягкий наезд камеры, 9:16 для Reels / Stories.

```
Slow cinematic push-in on the input screenshot shown on a modern smartphone lying on a white desk,
soft daylight from a window, shallow depth of field. Keep the screen content exactly as in the input,
no changes to text or UI. 6 seconds, subtle parallax, no text overlay, no people.
```

## Чего не генерировать

- Фото «команды», «клиентов», «довольных пользователей» — их нет, это будет ложь.
- Офисы, коворкинги, «работу за ноутбуком» — стоковый слоп, который снижает доверие.
- Логотипы площадок (NU, AlmaU и др.) — без разрешения не используем даже настоящие.
- Монограмму AZ в 3D — она уже живая на главной, сгенерированная версия будет хуже и не совпадёт со знаком.
