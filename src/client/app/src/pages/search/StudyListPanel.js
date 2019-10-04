import React from "react";
import { SearchResultsPanel } from "./search.jsx"

export default class StudyListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
            sortOptions={[
                {"name": "Date", "value": "date"},
                {"name": "Datasets", "value": "datasets_included"}, // This does not work, since for some reason
                {"name": "Tasks", "value": "tasks_included"},       // these three variables are not numbers, but
                {"name": "Flows", "value": "flows_included"}        // are actually strings, which ES cannot
            ]}                                                      // sort properly
            filterOptions={[]}
            type="study"
            nameField="name"
            descriptionField="description"

            processDescription={false}

            idField="study_id"

            stats={[
                {"unit": "datasets", "param": "datasets_included", "icon": "fa-database"},
                {"unit": "tasks", "param": "tasks_included", "icon": "fa-trophy"},
                {"unit": "flows", "param": "flows_included", "icon": "fa-gears"},

            ]}

            stats2={[]}
        ></SearchResultsPanel>
    }
}
