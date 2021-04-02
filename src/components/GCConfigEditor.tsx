import React, { ChangeEvent, PureComponent } from "react";
import { InfoBox, LegacyForms, Legend } from "@grafana/ui";
import { DataSourcePluginOptionsEditorProps } from "@grafana/data";
import { GCDataSourceOptions, GCSecureJsonData } from "../types";

const { SecretFormField } = LegacyForms;

interface Props
  extends DataSourcePluginOptionsEditorProps<GCDataSourceOptions> {}

interface State {}

export class GCConfigEditor extends PureComponent<Props, State> {
  onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonData: {
        apiKey: event.target.value,
      },
    });
  };

  onResetAPIKey = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        apiKey: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        apiKey: "",
      },
    });
  };

  render() {
    const { options } = this.props;
    const { secureJsonFields } = options;
    const secureJsonData = (options.secureJsonData || {}) as GCSecureJsonData;

    return (
      <>
        <Legend>Auth</Legend>
        <div className="gf-form-group">
          <SecretFormField
            isConfigured={secureJsonFields && secureJsonFields.apiKey}
            value={secureJsonData.apiKey || ""}
            label="API token"
            placeholder="secure field"
            labelWidth={8}
            inputWidth={20}
            onReset={this.onResetAPIKey}
            onChange={this.onAPIKeyChange}
          />
        </div>
        <div className="gf-form-group">
          <InfoBox title="How to create a API token?">
            <a
              href="https://support.gcorelabs.com/hc/en-us/articles/360018625617-API-tokens"
              target="_blank"
              rel="noreferrer"
            >
              https://support.gcorelabs.com/hc/en-us/articles/360018625617-API-tokens
            </a>
          </InfoBox>
        </div>
      </>
    );
  }
}
