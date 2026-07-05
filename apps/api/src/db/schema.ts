import { sql, SQL } from 'drizzle-orm';
import { customType, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * PostGIS `geography(Point, 4326)` column, mapped to `[lng, lat]` in TS.
 *
 * Establishes the geo-column convention the rider/driver live-tracking tables
 * build on in later stories. Drizzle emits the raw type in migrations so the
 * PostGIS extension is exercised from day one.
 */
export const point = customType<{ data: [number, number]; driverData: string }>({
  dataType() {
    return 'geography(Point, 4326)';
  },
  // Write [lng, lat] as a 4326 point. Returning SQL (vs a bound string) avoids
  // relying on a text->geography cast and keeps the coords as bound params.
  toDriver(value: [number, number]): SQL {
    return sql`ST_SetSRID(ST_MakePoint(${value[0]}, ${value[1]}), 4326)::geography`;
  },
  // PostGIS serializes geography as hex EWKB; decode the point back to [lng, lat].
  fromDriver(value: string): [number, number] {
    const buf = Buffer.from(value, 'hex');
    const le = buf.readUInt8(0) === 1;
    const readU32 = (o: number) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
    const readF64 = (o: number) => (le ? buf.readDoubleLE(o) : buf.readDoubleBE(o));
    const coordOffset = (readU32(1) & 0x20000000) !== 0 ? 9 : 5;
    return [readF64(coordOffset), readF64(coordOffset + 8)];
  },
});

/**
 * Placeholder table so `drizzle-kit generate` has a schema to diff against and
 * the PostGIS wiring is proven end to end. Real domain tables (riders, drivers,
 * trips, ledger) replace/extend this in the feature stories.
 */
export const serviceHeartbeat = pgTable('service_heartbeat', {
  id: uuid('id').defaultRandom().primaryKey(),
  location: point('location'),
  observedAt: timestamp('observed_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
