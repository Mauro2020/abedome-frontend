import { mdiCloudOutline } from "@mdi/js";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators";
import { fireEvent } from "../../../common/dom/fire_event";
import { navigate } from "../../../common/navigate";
import "../../../components/ha-svg-icon";
import "../../../panels/config/cloud/login/cloud-login";
import type { HomeAssistant } from "../../../types";
import { AssistantSetupStyles } from "../styles";

@customElement("cloud-step-signin")
export class CloudStepSignin extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public email?: string;

  render() {
    return html`<div class="content">
      <div class="cloud-brand-mark" role="img" aria-label="Cloud">
        <ha-svg-icon .path=${mdiCloudOutline}></ha-svg-icon>
      </div>
      <h1>${this.hass.localize("ui.panel.config.cloud.login.sign_in")}</h1>
      <cloud-login
        card-less
        check-connection
        .hass=${this.hass}
        .email=${this.email}
        @cloud-forgot-password=${this._forgotPassword}
        @cloud-logged-in=${this._loggedIn}
      ></cloud-login>
    </div>`;
  }

  private _loggedIn() {
    fireEvent(this, "cloud-step", { step: "DONE" });
  }

  private _forgotPassword() {
    navigate("/config/cloud/forgot-password");
    fireEvent(this, "closed");
  }

  static styles = [
    AssistantSetupStyles,
    css`
      :host {
        display: block;
      }
      .cloud-brand-mark {
        align-items: center;
        background: #0b0b0a;
        border-radius: var(--ha-border-radius-circle);
        color: #f5f1e8;
        display: flex;
        height: 64px;
        justify-content: center;
        margin: 0 auto var(--ha-space-4);
        width: 64px;
      }
      .cloud-brand-mark ha-svg-icon {
        height: 32px;
        width: 32px;
      }
      .content {
        width: 100%;
      }
      cloud-login {
        display: block;
        text-align: start;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "cloud-step-signin": CloudStepSignin;
  }
}
