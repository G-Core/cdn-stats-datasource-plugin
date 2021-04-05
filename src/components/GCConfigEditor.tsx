import React, { ChangeEvent, PureComponent } from "react";
import { InfoBox, LegacyForms, Legend } from "@grafana/ui";
import { DataSourcePluginOptionsEditorProps } from "@grafana/data";
import { GCDataSourceOptions, GCSecureJsonData } from "../types";
import { getAuthorizationValue } from "../token";

const { SecretFormField } = LegacyForms;

interface Props
  extends DataSourcePluginOptionsEditorProps<GCDataSourceOptions> {}

interface State {
  apiKey: string;
}

export class GCConfigEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const secureJsonData = (props.options.secureJsonData ||
      {}) as GCSecureJsonData;

    this.state = {
      apiKey: secureJsonData.apiKey || "",
    };
  }

  onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      apiKey: event.target.value,
    });
  };

  updateAPIKey = () => {
    const { onOptionsChange, options } = this.props;
    const apiKey = getAuthorizationValue(this.state.apiKey.trim());
    onOptionsChange({
      ...options,
      secureJsonData: { apiKey },
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
    const { apiKey } = this.state;
    const { secureJsonFields } = options;

    return (
      <>
        <Legend>Auth</Legend>
        <div className="gf-form-group">
          <SecretFormField
            isConfigured={secureJsonFields && secureJsonFields.apiKey}
            value={apiKey}
            label="API token"
            placeholder="secure field"
            labelWidth={8}
            inputWidth={20}
            onReset={this.onResetAPIKey}
            onBlur={this.updateAPIKey}
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
