import crypto from 'crypto';

class MemoryCollection {
  constructor(name) {
    this.name = name;
    this.data = [];
  }

  generateId() {
    return crypto.randomBytes(12).toString('hex');
  }

  _matches(item, query) {
    if (!query || Object.keys(query).length === 0) return true;
    for (const [key, val] of Object.entries(query)) {
      if (val === undefined) continue;
      if (key === '$or' && Array.isArray(val)) {
        const matchOr = val.some(orCondition => {
          return Object.entries(orCondition).every(([k, v]) => {
            if (v instanceof RegExp) return v.test(item[k] || '');
            return item[k] === v;
          });
        });
        if (!matchOr) return false;
        continue;
      }
      if (val instanceof RegExp) {
        if (!val.test(item[key] || '')) return false;
      } else if (typeof val === 'object' && val !== null) {
        if (val.$gte !== undefined) {
          const itemVal = item[key] instanceof Date ? item[key].getTime() : item[key];
          const queryVal = val.$gte instanceof Date ? val.$gte.getTime() : val.$gte;
          if (itemVal < queryVal) return false;
        }
        if (val.$lte !== undefined) {
          const itemVal = item[key] instanceof Date ? item[key].getTime() : item[key];
          const queryVal = val.$lte instanceof Date ? val.$lte.getTime() : val.$lte;
          if (itemVal > queryVal) return false;
        }
        if (val.$gt !== undefined && item[key] <= val.$gt) return false;
        if (val.$lt !== undefined && item[key] >= val.$lt) return false;
        if (val.$in !== undefined && !val.$in.includes(item[key])) return false;
        if (val.$ne !== undefined && item[key] === val.$ne) return false;
      } else if (item[key] !== val) {
        return false;
      }
    }
    return true;
  }

  find(query = {}) {
    let result = this.data.filter(item => this._matches(item, query)).map(d => ({ ...d }));

    const chain = {
      _data: result,
      sort(sortObj = {}) {
        const entries = Object.entries(sortObj);
        if (entries.length > 0) {
          const [field, order] = entries[0];
          const dir = order === -1 || order === 'desc' ? -1 : 1;
          this._data.sort((a, b) => {
            let valA = a[field];
            let valB = b[field];
            if (valA instanceof Date) valA = valA.getTime();
            if (valB instanceof Date) valB = valB.getTime();
            if (valA < valB) return -1 * dir;
            if (valA > valB) return 1 * dir;
            return 0;
          });
        }
        return this;
      },
      skip(count) {
        if (count > 0) this._data = this._data.slice(count);
        return this;
      },
      limit(count) {
        if (count > 0) this._data = this._data.slice(0, count);
        return this;
      },
      populate() {
        return this;
      },
      lean() {
        return this;
      },
      then(resolve, reject) {
        return Promise.resolve(this._data).then(resolve, reject);
      },
      catch(reject) {
        return Promise.resolve(this._data).catch(reject);
      },
      [Symbol.iterator]() {
        return this._data[Symbol.iterator]();
      }
    };

    return chain;
  }

  async findById(id) {
    const item = this.data.find(d => d._id?.toString() === id?.toString());
    return item ? { ...item } : null;
  }

  async findOne(query = {}) {
    const list = this.data.filter(item => this._matches(item, query));
    return list[0] ? { ...list[0] } : null;
  }

  async create(doc) {
    const newDoc = {
      _id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...doc
    };
    this.data.push(newDoc);
    return { ...newDoc };
  }

  async insertMany(docs = []) {
    const created = docs.map(doc => ({
      _id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...doc
    }));
    this.data.push(...created);
    return created.map(d => ({ ...d }));
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const idx = this.data.findIndex(d => d._id?.toString() === id?.toString());
    if (idx === -1) return null;
    const current = this.data[idx];
    const updated = {
      ...current,
      ...(update.$set || update),
      updatedAt: new Date()
    };
    this.data[idx] = updated;
    return options.new !== false ? { ...updated } : { ...current };
  }

  async findByIdAndDelete(id) {
    const idx = this.data.findIndex(d => d._id?.toString() === id?.toString());
    if (idx === -1) return null;
    const removed = this.data.splice(idx, 1)[0];
    return { ...removed };
  }

  async deleteMany(query = {}) {
    const initialLen = this.data.length;
    if (Object.keys(query).length === 0) {
      this.data = [];
      return { deletedCount: initialLen };
    }
    const toKeep = this.data.filter(item => !this._matches(item, query));
    const deletedCount = this.data.length - toKeep.length;
    this.data = toKeep;
    return { deletedCount };
  }

  async countDocuments(query = {}) {
    const matched = this.data.filter(item => this._matches(item, query));
    return matched.length;
  }
}

export const memoryStore = {
  users: new MemoryCollection('users'),
  transactions: new MemoryCollection('transactions'),
  anomalies: new MemoryCollection('anomalies'),
  insights: new MemoryCollection('insights')
};
