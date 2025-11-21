import "@stdlib/deploy";

// ═══════════════════════════════════════════════════════════════════
// SIMPLIFIED CONTRACT - ONLY STORES SENSOR DATA
// Device management happens in NestJS!
// ═══════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────
// DATA STRUCTURES - Just the sensor readings
// ───────────────────────────────────────────────────────────────────

struct GpsData {
    id: Int as uint64;
    deviceId: Int as uint64;
    companyId: Int as uint64;
    lat: String;
    lng: String;
    speed: String;
    sats: String;
    timestamp: Int as uint32;
}

struct AirData {
    id: Int as uint64;
    deviceId: Int as uint64;
    companyId: Int as uint64;
    ppm: String;
    status: String;
    ro: String;
    timestamp: Int as uint32;
}

// ───────────────────────────────────────────────────────────────────
// MESSAGES - Simple data recording
// ───────────────────────────────────────────────────────────────────

message(0x99a87bd1) RecordGpsData {
    deviceId: Int as uint64;
    companyId: Int as uint64;
    lat: String;
    lng: String;
    speed: String;
    sats: String;
}

message(0xfc5d972b) RecordAirData {
    deviceId: Int as uint64;
    companyId: Int as uint64;
    ppm: String;
    status: String;
    ro: String;
}

// ───────────────────────────────────────────────────────────────────
// MAIN CONTRACT - Clean and Simple!
// ───────────────────────────────────────────────────────────────────

contract IoTDataRegistry with Deployable {
    owner: Address;

    // Simple counters for record IDs
    nextGpsId: Int as uint64 = 1;
    nextAirId: Int as uint64 = 1;

    // Just store the data!
    gpsRecords: map<Int as uint64, GpsData>; // id -> GPS data
    airRecords: map<Int as uint64, AirData>; // id -> Air data

    // Quick lookup for latest readings per device
    latestGps: map<Int as uint64, Int as uint64>; // deviceId -> latest gpsId
    latestAir: map<Int as uint64, Int as uint64>; // deviceId -> latest airId

    init(owner: Address) {
        self.owner = owner;
    }

    receive() {}

    // ───────────────────────────────────────────────────────────────
    // RECORD GPS DATA - Simple and Fast
    // ───────────────────────────────────────────────────────────────
    receive(msg: RecordGpsData) {
        // Create GPS record
        let gpsData: GpsData = GpsData {
            id: self.nextGpsId,
            deviceId: msg.deviceId,
            companyId: msg.companyId,
            lat: msg.lat,
            lng: msg.lng,
            speed: msg.speed,
            sats: msg.sats,
            timestamp: now(),
        };

        // Store it
        self.gpsRecords.set(self.nextGpsId, gpsData);
        self.latestGps.set(msg.deviceId, self.nextGpsId);
        self.nextGpsId += 1;
    }

    // ───────────────────────────────────────────────────────────────
    // RECORD AIR DATA - Simple and Fast
    // ───────────────────────────────────────────────────────────────
    receive(msg: RecordAirData) {
        // Create Air record
        let airData: AirData = AirData {
            id: self.nextAirId,
            deviceId: msg.deviceId,
            companyId: msg.companyId,
            ppm: msg.ppm,
            status: msg.status,
            ro: msg.ro,
            timestamp: now(),
        };

        // Store it
        self.airRecords.set(self.nextAirId, airData);
        self.latestAir.set(msg.deviceId, self.nextAirId);
        self.nextAirId += 1;
    }

    // ───────────────────────────────────────────────────────────────
    // GETTER FUNCTIONS (FREE - No gas cost)
    // ───────────────────────────────────────────────────────────────

    get fun getGpsData(id: Int): GpsData? {
        return self.gpsRecords.get(id);
    }

    get fun getAirData(id: Int): AirData? {
        return self.airRecords.get(id);
    }

    get fun getLatestGps(deviceId: Int): GpsData? {
        let latestId: Int? = self.latestGps.get(deviceId);
        if (latestId == null) {
            return null;
        }
        return self.gpsRecords.get(latestId!!);
    }

    get fun getLatestAir(deviceId: Int): AirData? {
        let latestId: Int? = self.latestAir.get(deviceId);
        if (latestId == null) {
            return null;
        }
        return self.airRecords.get(latestId!!);
    }

    get fun getTotalGpsRecords(): Int {
        return self.nextGpsId - 1;
    }

    get fun getTotalAirRecords(): Int {
        return self.nextAirId - 1;
    }

    // ───────────────────────────────────────────────────────────────
    // DEBUG HELPER FUNCTIONS - To diagnose device ID issues
    // ───────────────────────────────────────────────────────────────
    
    // Get the latest GPS record ID for a device (returns null if device has no records)
    get fun getLatestGpsId(deviceId: Int): Int? {
        return self.latestGps.get(deviceId);
    }

    // Get the latest Air record ID for a device (returns null if device has no records)
    get fun getLatestAirId(deviceId: Int): Int? {
        return self.latestAir.get(deviceId);
    }

    // Helper function
    fun min(a: Int, b: Int): Int {
        if (a < b) {
            return a;
        }
        return b;
    }

    get fun getAllGpsData(): map<Int, GpsData> {
        let results: map<Int, GpsData> = emptyMap();

        // Check if there are any records
        if (self.nextGpsId <= 1) {
            return results; // Return empty map if no records
        }

        // Iterate from 1 to nextGpsId - 1 (records start at ID 1)
        let i: Int = 1;
        while (i < self.nextGpsId) {
            let data: GpsData? = self.gpsRecords.get(i);
            if (data != null) {
                results.set(i, data!!);
            }
            i += 1;
        }
        return results;
    }

    get fun getAllAirData(): map<Int, AirData> {
        let results: map<Int, AirData> = emptyMap();

        // Check if there are any records
        if (self.nextAirId <= 1) {
            return results; // Return empty map if no records
        }
        
        // Iterate from 1 to nextAirId - 1 (records start at ID 1)
        let i: Int = 1;
        while (i < self.nextAirId) {
            let data: AirData? = self.airRecords.get(i);
            if (data != null) {
                results.set(i, data!!);
            }
            i += 1;
        }
        return results;
    }
}
