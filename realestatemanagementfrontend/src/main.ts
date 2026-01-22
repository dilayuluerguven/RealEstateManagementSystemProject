import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

(async () => {
  try {
    await platformBrowserDynamic().bootstrapModule(AppModule);
  } catch (err) {
    console.error(err);
  }
})();
