import React, { ChangeEvent, PureComponent } from "react";
import { Alert, Legend, LegacyForms } from "@grafana/ui";
import { DataSourcePluginOptionsEditorProps } from "@grafana/data";
import { GCDataSourceOptions, GCJsonData, GCSecureJsonData } from "../types";
import { getAuthorizationValue, getHostnameValue } from "../token";

const { FormField, SecretFormField } = LegacyForms;

interface Props
  extends DataSourcePluginOptionsEditorProps<GCDataSourceOptions> {}

interface State {
  apiKey: string;
  apiUrl: string;
}

export class GCConfigEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const secureJsonData = (props.options.secureJsonData ||
      {}) as GCSecureJsonData;
    const jsonData = (props.options.jsonData || {}) as GCJsonData;

    this.state = {
      apiKey: secureJsonData.apiKey || "",
      apiUrl: jsonData.apiUrl || "",
    };
  }

  onApiUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      apiUrl: event.target.value,
    });
  };

  updateApiUrl = () => {
    const { onOptionsChange, options } = this.props;
    const apiUrl = getHostnameValue(this.state.apiUrl.trim());
    onOptionsChange({
      ...options,
      jsonData: { apiUrl },
    });
  };

  onApiKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      apiKey: event.target.value,
    });
  };

  updateApiKey = () => {
    const { onOptionsChange, options } = this.props;
    const apiKey = getAuthorizationValue(this.state.apiKey.trim());
    onOptionsChange({
      ...options,
      secureJsonData: { apiKey },
    });
  };

  onResetApiKey = () => {
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
    const { apiKey, apiUrl } = this.state;
    const { secureJsonFields } = options;
    const isConfigured = secureJsonFields && secureJsonFields.apiKey;

    return (
      <>
        <Legend>HTTP</Legend>

        <div className="gf-form-group">
          <FormField
            label={"URL"}
            labelWidth={8}
            inputWidth={20}
            placeholder={"API base url"}
            value={apiUrl}
            onChange={this.onApiUrlChange}
            onBlur={this.updateApiUrl}
            required={true}
          />
        </div>

        <div className="gf-form-group">
          <SecretFormField
            isConfigured={isConfigured}
            label="API key"
            placeholder="Secure field"
            labelWidth={8}
            inputWidth={20}
            value={apiKey}
            onChange={this.onApiKeyChange}
            onBlur={this.updateApiKey}
            onReset={this.onResetApiKey}
          />
        </div>

        <div className="gf-form-group">
          <Alert severity={"info"} title="How to create a API token?">
            <a
              href="https://support.edgecenter.ru/knowledge_base/item/257788?sid=57461"
              target="_blank"
              rel="noreferrer"
            >
              https://support.edgecenter.ru/knowledge_base/item/257788?sid=57461
            </a>
          </Alert>
        </div>
      </>
    );
  }
}
