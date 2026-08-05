import type { TemplateResult } from "lit";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators";

@customElement("abedome-logo-svg")
export class AbedomeLogoSvg extends LitElement {
  @property() public title = "ABEDOME";

  protected render(): TemplateResult {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        role="img"
        aria-label=${this.title}
      >
        <rect width="1024" height="1024" rx="180" fill="#0B0B0A"></rect>
        <path
          d="M421 763 A280 280 0 1 1 603 763"
          fill="none"
          stroke="#F5F1E8"
          stroke-width="38"
        ></path>
        <rect x="491" y="575" width="42" height="195" fill="#F5F1E8"></rect>
        <circle cx="568" cy="718" r="17" fill="#FF6232"></circle>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "abedome-logo-svg": AbedomeLogoSvg;
  }
}
