import { dataHeap } from "../appState.js";
import { bcOperation } from "../libs/bcLib.js";

export const refreshEntities = async () => {
    dataHeap.entities = await bcOperation('GetEntities', {});
}