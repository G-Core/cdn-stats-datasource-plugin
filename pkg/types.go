package main

type SelectableValue struct {
	Label string `json:"label"`
	Value string `json:"value"`
}

type QueryModel struct {
	Metric      SelectableValue   `json:"metric"`
	Granularity SelectableValue   `json:"granularity"`
	Grouping    []SelectableValue `json:"grouping,omitempty"`
	Vhosts      string            `json:"vhosts,omitempty"`
	Resources   string            `json:"resources,omitempty"`
	Countries   string            `json:"countries,omitempty"`
	Regions     string            `json:"regions,omitempty"`
	Clients     string            `json:"clients,omitempty"`
	Legend      string            `json:"legendFormat,omitempty"`
}

type StatsRequest struct {
	Metrics     []string `json:"metrics"`
	Granularity string   `json:"granularity"`
	From        string   `json:"from"`
	To          string   `json:"to"`
	Vhosts      []string `json:"vhosts,omitempty"`
	Resources   []int64  `json:"resources,omitempty"`
	Countries   []string `json:"countries,omitempty"`
	Regions     []string `json:"regions,omitempty"`
	Clients     []int64  `json:"clients,omitempty"`
	GroupBy     []string `json:"group_by,omitempty"`
	Flat        bool     `json:"flat"`
}

type StatsResponse struct {
	Metrics  map[string][][2]float64 `json:"metrics"`
	Client   *int                    `json:"client,omitempty"`
	Region   string                  `json:"region,omitempty"`
	Vhost    string                  `json:"vhost,omitempty"`
	Country  string                  `json:"country,omitempty"`
	DC       string                  `json:"dc,omitempty"`
	Resource *int                    `json:"resource,omitempty"`
}
