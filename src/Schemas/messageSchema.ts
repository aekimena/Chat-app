import Realm from 'realm';

export class Messages extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  recepientId!: Realm.List<Realm.BSON.ObjectId>;
  senderId!: Realm.BSON.ObjectId;
  createdAt!: Date;
  messageType!: String;
  text?: String;
  image?: String;
  status!: String;

  static schema: Realm.ObjectSchema = {
    name: 'Messages',
    properties: {
      _id: 'objectId',
      recepientId: 'objectId[]',
      senderId: 'objectId',
      createdAt: 'date',
      messageType: 'string',
      text: 'string?',
      image: 'string?',
      status: 'string',
    },
    primaryKey: '_id',
  };
}
