import { mdiAccountGroup, mdiFileDocument } from "@mdi/js";
import type { TemplateResult } from "lit";
import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators";
import { consumeLocalize } from "../common/decorators/consume-context-entry";
import type { LocalizeFunc } from "../common/translations/localize";
import "../components/ha-card";
import { showCommunityDialog } from "./dialogs/show-community-dialog";
import "./onboarding-welcome-link";

@customElement("onboarding-welcome-links")
class OnboardingWelcomeLinks extends LitElement {
  @state()
  @consumeLocalize()
  private _localize!: LocalizeFunc;

  protected render(): TemplateResult {
    return html`<a
        target="_blank"
        rel="noreferrer noopener"
        href="https://www.home-assistant.io/blog/2016/01/19/perfect-home-automation/"
      >
        <onboarding-welcome-link
          noninteractive
          .iconPath=${mdiFileDocument}
          .label=${this._localize("ui.panel.page-onboarding.welcome.vision")}
        >
        </onboarding-welcome-link>
      </a>
      <onboarding-welcome-link
        class="community"
        @click=${this._openCommunity}
        .iconPath=${mdiAccountGroup}
        .label=${this._localize("ui.panel.page-onboarding.welcome.community")}
      >
      </onboarding-welcome-link>`;
  }

  private _openCommunity(): void {
    showCommunityDialog(this);
  }

  static styles = css`
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      margin-top: 16px;
      column-gap: var(--ha-space-4);
      row-gap: var(--ha-space-4);
    }
    @media (max-width: 550px) {
      :host {
        grid-template-columns: 1fr;
      }
    }
    .community {
      --welcome-link-color: #008142;
    }
    a {
      text-decoration: none;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "onboarding-welcome-links": OnboardingWelcomeLinks;
  }
}
