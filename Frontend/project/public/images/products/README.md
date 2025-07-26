# Product Images

This folder contains images for the products displayed on the Products page.

## How to Add Product Images

1. **Add your image files** to this folder (`public/images/products/`)
2. **Use descriptive names** like:
   - `organic-tomatoes.jpg`
   - `teff.jpg`
   - `sweet-peppers.jpg`
   - `organic-carrots.jpg`
   - `green-beans.jpg`
   - `coffee.jpg`

3. **Supported formats**: JPG, PNG, WebP

4. **Recommended size**: 400x300 pixels or similar aspect ratio

5. **Update the code** in `app/products/page.tsx` to reference your new image:
   ```tsx
   { name: 'Your Product', farmer: 'Farmer Name', location: 'Location', price: '100 ETB/kg', image: '/images/products/your-image-name.jpg' }
   ```

## Current Images Needed

- `organic-tomatoes.jpg` - Organic tomatoes
- `teff.jpg` - Teff grain
- `sweet-peppers.jpg` - Sweet peppers
- `organic-carrots.jpg` - Organic carrots
- `green-beans.jpg` - Green beans
- `coffee.jpg` - Coffee beans

## Note

Images in the `public` folder are served statically by Next.js and can be referenced directly with paths starting with `/`. 