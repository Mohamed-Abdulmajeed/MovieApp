import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class PageTitleService {
  private defaultTitle = 'MovieApp';

  constructor(private titleService: Title, private metaService: Meta) {}

  /**
   * Set page title
   */
  setTitle(title: string): void {
    this.titleService.setTitle(`${title} - ${this.defaultTitle}`);
  }

  /**
   * Set page description
   */
  setDescription(description: string): void {
    this.metaService.updateTag({
      name: 'description',
      content: description
    });
  }

  /**
   * Set default title
   */
  setDefaultTitle(): void {
    this.titleService.setTitle(this.defaultTitle);
  }
}
