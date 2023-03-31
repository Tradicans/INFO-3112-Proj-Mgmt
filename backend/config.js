import { config } from "dotenv";

config();
export const db = process.env.DB;
export const dbUrl = process.env.DBURL;
export const port = process.env.PORT;
export const userColl = process.env.USERCOLLECTION;
export const taskColl = process.env.TASKCOLLECTION;
export const sprintColl = process.env.SPRINTCOLLECTION;
export const productColl = process.env.PRODUCTCOLLECTION;
export const storyColl = process.env.STORYCOLLECTION;
