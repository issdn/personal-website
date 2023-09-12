import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import {
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
  CANVAS_X,
  NEW_PIXELS_COL_NAME,
  VERIFIED_PIXELS_COL_NAME,
  MONGODB_DB_NAME,
} from "$env/static/private";
import { error, json, type RequestEvent } from "@sveltejs/kit";

const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_DB_NAME}.sa6rvct.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const generateDefaultCanvas = () => {
  return `${CANVAS_X},${parseInt(CANVAS_X) ** 2}`;
};

export async function GET({ setHeaders }) {
  setHeaders({
    "Cache-Control": "public, max-age=86400",
  });
  const collection = client
    .db("karolbielski")
    .collection(VERIFIED_PIXELS_COL_NAME);
  try {
    await client.connect();
    const cellsDoc = await (await collection.find().toArray())[0];
    if (!cellsDoc) {
      const insertedId = (
        await collection.insertOne({
          cells: generateDefaultCanvas(),
        })
      ).insertedId;
      const cellsDoc = await collection.findOne({ _id: insertedId });
      if (!cellsDoc) {
        throw error(500, "Couldn't insert default canvas into database.");
      }
      return json({ cells: cellsDoc.cells });
    }
    return json({ cells: cellsDoc.cells });
  } catch (e) {
    await client.close();
    throw error(
      500,
      "Something went wrong while fetching canvas from database."
    );
  } finally {
    await client.close();
  }
}

export async function POST({ request }: RequestEvent) {
  const { cells } = await request.json();
  if (!cells) {
    throw error(400, "No cells provided.");
  }
  if (!/^(\d+|#([A-z,0-9]{6}\d+))(,(\d+|#([A-z,0-9]{6}\d+)))*$/.test(cells)) {
    throw error(400, "Incorrect data format.");
  }
  try {
    await client.connect();
    await client
      .db("karolbielski")
      .collection(NEW_PIXELS_COL_NAME)
      .insertOne({ _id: new ObjectId(), cells: cells });
    return json({ message: "Your art has been saved to database." });
  } catch (e) {
    await client.close();
    throw error(500, "Something went wrong while saving your art to database.");
  } finally {
    await client.close();
  }
}
