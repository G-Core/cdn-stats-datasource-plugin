import React, { ChangeEvent, PureComponent } from "react";
import { Alert, Legend, InlineField, Input, SecretInput } from "@grafana/ui";
import { DataSourcePluginOptionsEditorProps } from "@grafana/data";
import { GCDataSourceOptions, GCJsonData, GCSecureJsonData } from "../types";
import { getAuthorizationValue, getHostnameValue } from "../token";

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
          <InlineField
            invalid={apiUrl === ""}
            labelWidth={16}
            error={apiUrl === "" ? "This input is required" : ""}
            required={true}
            label={"URL"}
          >
            <Input
              value={apiUrl}
              width={40}
              placeholder={"API base url"}
              onChange={this.onApiUrlChange}
              onBlur={this.updateApiUrl}
            />
          </InlineField>
        </div>

        <div className="gf-form-group">
          <InlineField
            invalid={apiKey === "" && !isConfigured}
            labelWidth={16}
            error={
              apiKey === "" && !isConfigured ? "This input is required" : ""
            }
            required={true}
            label="API token"
          >
            <SecretInput
              isConfigured={isConfigured}
              value={apiKey}
              placeholder="Secure field"
              width={40}
              onReset={this.onResetApiKey}
              onBlur={this.updateApiKey}
              onChange={this.onApiKeyChange}
            />
          </InlineField>
        </div>

        <div className="gf-form-group">
          <Alert title="How to create a API token?">
            <a
              href="https://support.gcorelabs.com/hc/en-us/articles/360018625617-API-tokens"
              target="_blank"
              rel="noreferrer"
            >
              https://support.gcorelabs.com/hc/en-us/articles/360018625617-API-tokens
            </a>
          </Alert>
        </div>
      </>
    );
  }
}
