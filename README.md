# Leo Leathers — Live Cart & Wishlist

A leather-goods shop page with a working **shopping cart** and **wishlist**, built in plain JavaScript.

Keylife Training task: the page design is the free [Leo template by TemplatesJungle](https://templatesjungle.com); the cart and wishlist functionality is my work.

## What I built

- **Add to cart** from any product card, without leaving the page
- **Cart panel:** product photo, quantity + / −, remove, live total
- **Wishlist:** heart toggle on each product, wishlist panel with "Move to cart"
- **Live badge counters** on the header cart and wishlist icons
- **Saved between visits:** cart and wishlist are stored in `localStorage`
- Product data (name, price, image) is read directly from the product cards on the page, so there is no second product list to keep in sync

## My files

| File | What it does |
|---|---|
| `js/cart.js` | All cart and wishlist logic: reading products, add / remove / quantity, wishlist toggle, saving, drawing the panels and badges |
| `css/cart.css` | Styles for the badges, active hearts, cart lines and pop-up messages |
| `index.html` | Small additions to the template: badge elements, cart list, wishlist panel, and the script/style links |

## Run it

Open `index.html` in a browser (needs internet for Bootstrap, Swiper and fonts, which load from a CDN).

## Credits

Template: Leo by [TemplatesJungle](https://templatesjungle.com), free for personal and commercial use with the credit link kept in the footer.
