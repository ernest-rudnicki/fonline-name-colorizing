import "regenerator-runtime/runtime";
import { configure, EnzymeAdapter } from "enzyme";
import Adapter from "enzyme-adapter-preact-pure";

configure({
  adapter: new Adapter() as EnzymeAdapter,
});
