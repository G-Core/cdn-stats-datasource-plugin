import React, { ChangeEvent, PureComponent } from "react";
import { LegacyForms } from "@grafana/ui";
import { DataSourcePluginOptionsEditorProps } from "@grafana/data";
import { MyDataSourceOptions, MySecureJsonData } from "./types";

const { SecretFormField } = LegacyForms;

interface Props
  extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  // Secure field (only sent to the backend)
  onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonData: {
        apiKey: event.target.value
      }
    });
  };

  onResetAPIKey = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        apiKey: false
      },
      secureJsonData: {
        ...options.secureJsonData,
        apiKey: ""
      }
    });
  };

  render() {
    const { options } = this.props;
    const { secureJsonFields } = options;
    const secureJsonData = (options.secureJsonData || {}) as MySecureJsonData;

    return (
      <div className="gf-form-group">
        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              isConfigured={
                (secureJsonFields && secureJsonFields.apiKey) as boolean
              }
              value={secureJsonData.apiKey || ""}
              label="Auth header"
              tooltip="Auth header value e.g. Bearer XXX"
              placeholder="secure field (backend only)"
              labelWidth={8}
              inputWidth={20}
              onReset={this.onResetAPIKey}
              onChange={this.onAPIKeyChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
