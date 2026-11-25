import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { EntryDetails } from "./ItemDetail.js";
import { getItem } from "./api.js";

jest.mock("./api.js", () => ({
  getItem: jest.fn(),
}));

// The detail views are not under test and pull in ESM-only dependencies.
jest.mock("./Dataset.js", () => ({ DatasetItem: () => null }));
jest.mock("./TaskType.js", () => ({ TaskTypeItem: () => null }));
jest.mock("./Measure.js", () => ({ MeasureItem: () => null }));
jest.mock("./Task.js", () => ({ TaskItem: () => null }));
jest.mock("./Flow.js", () => ({ FlowItem: () => null }));
jest.mock("./Run.js", () => ({ RunItem: () => null }));
jest.mock("./Study.js", () => ({ StudyItem: () => null }));
jest.mock("./User.js", () => ({ UserItem: () => null }));

describe("EntryDetails with a missing ID", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    getItem.mockRejectedValue("[ElasticSearch] 404: Not Found");
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });

  test.each(["benchmark", "study", "data"])(
    "shows the not-found message for type %s",
    async (type) => {
      await act(async () => {
        ReactDOM.render(
          <EntryDetails
            type={type}
            entity="999999"
            filters={{ study_type: { value: "task" } }}
            location={{ pathname: "/search", search: "" }}
            history={{ push: jest.fn() }}
          />,
          container
        );
      });

      expect(container.textContent).toContain(
        `This is not the ${type} you are looking for.`
      );
    }
  );
});
