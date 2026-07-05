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
