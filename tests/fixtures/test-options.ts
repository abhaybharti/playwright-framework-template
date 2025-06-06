//This file is used for merging all extended test fixtures
import { mergeTests, test as base } from "@playwright/test";
import {test as customFixture} from "./customFixtures";

const test = mergeTests(customFixture);

const expect = base.expect;
export {test,expect};