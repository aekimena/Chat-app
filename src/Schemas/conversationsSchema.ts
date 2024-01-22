import Realm from 'realm';

export class Conversations extends Realm.Object<Conversations> {
  _id!: Realm.BSON.ObjectId;
  conversationType?: String;
  members!: Realm.List<Realm.BSON.ObjectId>;
  messages?: Realm.List<Realm.BSON.ObjectId>;
  membersTyping?: Realm.List<Realm.BSON.ObjectId>;
  modifiedAt?: Date;
  createdAt!: Date;
  static schema: Realm.ObjectSchema = {
    name: 'Conversations',
    properties: {
      _id: 'objectId',
      conversationType: 'string?',
      members: 'objectId[]',
      messages: 'objectId[]',
      membersTyping: 'objectId[]',
      modifiedAt: 'date?',
      createdAt: 'date',
    },
    primaryKey: '_id',
  };
}
