import { Request } from "cross-fetch";
import * as boom from "@hapi/boom";
import * as httpErrors from "http-errors";
import { errorHandler } from "./index";

describe("error handler", () => {
  describe("default accepts", () => {
    const req = new Request("/");
    const handler = errorHandler(req);

    it("should fail gracefully with non-error", async () => {
      const res = handler("test");

      expect(await res.text()).toMatchSnapshot();
    });

    it("should fail gracefully with empty error", async () => {
      const res = handler(undefined);

      expect(await res.text()).toMatchSnapshot();
    });

    it("should render an error", async () => {
      const res = handler(new Error("boom!"));

      expect(await res.text()).toMatchSnapshot();
    });

    it("should render boom status errors", async () => {
      const res = handler(boom.badRequest("data has an issue"));

      expect(await res.text()).toMatchSnapshot();
    });

    it("should render http errors status error", async () => {
      const res = handler(new httpErrors.BadRequest("data has an issue"));

      expect(await res.text()).toMatchSnapshot();
    });
  });

  describe("accept html", () => {
    const req = new Request("/", { headers: { accept: "text/html" } });
    const handler = errorHandler(req);

    it("should fail and return html", async () => {
      const res = handler(new Error("boom!"));

      expect(res.headers.get("content-type")).toEqual("text/html");
      expect(await res.text()).toMatchSnapshot();
    });
  });

  describe("accept json", () => {
    const req = new Request("/", { headers: { accept: "application/json" } });
    const handler = errorHandler(req);

    it("should fail and return json", async () => {
      const res = handler(new Error("boom!"));

      expect(res.headers.get("content-type")).toEqual("application/json");
      expect(await res.text()).toMatchSnapshot();
    });
  });
});
