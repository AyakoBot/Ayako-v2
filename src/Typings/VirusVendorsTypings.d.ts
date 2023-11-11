export type KasperskyZone = 'Red' | 'Grey' | 'Green' | 'Yellow';
export type KasperskyCategory = 'CATEGORY_PHISHING' | string;
export type ContactType = 'registrant' | 'administrative' | 'technical';
export type Organization = 'Private Person' | string;

export type Kaspersky = {
 Zone: KasperskyZone;
 DomainGeneralInfo: {
  UrlsCount: number;
  HitsCount: number;
  Domain: string;
  Ipv4Count: number;
  Categories: KasperskyCategory[];
  CategoriesWithZone: {
   Name: KasperskyCategory;
   Zone: KasperskyZone;
  }[];
 };
 DomainWhoIsInfo: {
  DomainName: string;
  Created: string; // Date string in ISO format
  Updated: string; // Date string in ISO format
  Expires: string; // Date string in ISO format
  NameServers: string[];
  Contacts: {
   ContactType: ContactType;
   Name: string;
   Organization: Organization;
   Address: string;
   City: string;
   State: string;
   PostalCode: string;
   CountryCode: string;
   Phone: string;
   Fax: string;
   Email: string;
  }[];
  Registrar: {
   Info: string;
   IanaId: '1606';
  };
  DomainStatus: string[]; // usually "<key> <url>"
  RegistrationOrganization: number;
 };
};

// Example:
// {
//  Zone: 'Red';
//  DomainGeneralInfo: {
//   UrlsCount: 10;
//   HitsCount: 10;
//   Domain: 'example.com';
//   Ipv4Count: 16;
//   Categories: ['CATEGORY_PHISHING'];
//   CategoriesWithZone: [
//    {
//     Name: 'CATEGORY_PHISHING';
//     Zone: 'Red';
//    },
//   ];
//  };
//  DomainWhoIsInfo: {
//   DomainName: 'example.com';
//   Created: '2023-07-11T21:00:00Z';
//   Updated: '2023-07-12T21:00:00Z';
//   Expires: '2024-07-11T21:00:00Z';
//   NameServers: ['darwin.ns.cloudflare.com', 'veronica.ns.cloudflare.com'];
//   Contacts: [
//    {
//     ContactType: 'registrant';
//     Name: 'Example Name';
//     Organization: 'Private Person';
//     Address: 'Example str., 12, ap. 34';
//     City: 'Moscow';
//     State: 'Moscow';
//     PostalCode: '161351';
//     CountryCode: 'RU';
//     Phone: '+1.1234567890';
//     Fax: '+1.1234567890';
//     Email: 'example@mail.com';
//    },
//    {
//     ContactType: 'administrative';
//     Name: 'Example Name';
//     Organization: 'Private Person';
//     Address: 'Lenin str., 12, ap. 34';
//     City: 'Moscow';
//     State: 'Moscow';
//     PostalCode: '161351';
//     CountryCode: 'RU';
//     Phone: '+1.1234567890';
//     Fax: '+1.1234567890';
//     Email: 'example@mail.com';
//    },
//    {
//     ContactType: 'technical';
//     Name: 'Example Name';
//     Organization: 'Private Person';
//     Address: 'Lenin str., 12, ap. 34';
//     City: 'Moscow';
//     State: 'Moscow';
//     PostalCode: '161351';
//     CountryCode: 'RU';
//     Phone: '+1.1234567890';
//     Fax: '+1.1234567890';
//     Email: 'example@mail.com';
//    },
//   ];
//   Registrar: {
//    Info: 'Registrar of domain names REG.RU LLC';
//    IanaId: '0000';
//   };
//   DomainStatus: ['clientTransferProhibited http://www.icann.org/epp#clientTransferProhibited'];
//   RegistrationOrganization: 'Registrar of domain names REG.RU LLC';
//  };
// };

export type DBL = {
 status: 200 | 404;
 resp: number[]; // Years
};

// Example:
// {
//  status: 200,
//  resp: [
//      2002
//  ]
// }

export type GoogleThreatType =
 | 'THREAT_TYPE_UNSPECIFIED'
 | 'MALWARE'
 | 'SOCIAL_ENGINEERING'
 | 'UNWANTED_SOFTWARE'
 | 'POTENTIALLY_HARMFUL_APPLICATION';
export type GoogleThreadEntryType = 'THREAT_ENTRY_TYPE_UNSPECIFIED' | 'URL' | 'EXECUTABLE';
export type GooglePlatformType =
 | 'PLATFORM_TYPE_UNSPECIFIED'
 | 'WINDOWS'
 | 'LINUX'
 | 'ANDROID'
 | 'OSX'
 | 'IOS'
 | 'ANY_PLATFORM'
 | 'ALL_PLATFORMS'
 | 'CHROME';

export type GoogleSafeBrowsing = {
 matches: {
  threatType: GoogleThreatType;
  platformType: GooglePlatformType;
  threat: {
   url: string;
  };
  cacheDuration: string; // Example: 300s
  threatEntryType: GoogleThreadEntryType;
 }[];
};

// Example:
// {
//  matches: [
//   {
//    threatType: "SOCIAL_ENGINEERING",
//    platformType: "ALL_PLATFORMS",
//    threat: {
//     url: "https://example.com"
//    },
//    cacheDuration: "300s",
//    threatEntryType: "URL"
//   }
//  ]
// }

export type PromptAPI =
 | {
    result: 'not found';
    message: string;
   }
 | {
    result: {
     domain_name: string;
     registrar: string;
     whois_server: string;
     referral_url: string | null;
     updated_date: string; // Date string not ISO format
     creation_date: string; // Date string not ISO format
     expiration_date: string; // Date string not ISO format
     name_servers: string[];
     status: string; // usually '<key> <url>';
     emails: string;
     dnssec: string;
     name: string | null;
     org: string | null;
     address: string | null;
     city: string | null;
     state: string | null;
     zipcode: string | null;
     country: string | null;
    };
   };

// Example:
// {
//  result: {
//   domain_name: 'EXAMPLE.COM';
//   registrar: 'Launchpad.com Inc.';
//   whois_server: 'whois.launchpad.com';
//   referral_url: null;
//   updated_date: '2023-11-05 15:01:19';
//   creation_date: '2023-11-05 14:55:39';
//   expiration_date: '2024-11-05 14:55:39';
//   name_servers: ['DEAN.NS.CLOUDFLARE.COM', 'MELINA.NS.CLOUDFLARE.COM'];
//   status: 'clientTransferProhibited https://icann.org/epp#clientTransferProhibited';
//   emails: 'abuse@hostgator.com';
//   dnssec: 'unsigned';
//   name: null;
//   org: null;
//   address: null;
//   city: null;
//   state: null;
//   zipcode: null;
//   country: null;
//  };
// };

type VirusTotalURLs = {
 data: {
  type: 'analysis';
  id: string;
  links: {
   self: string;
  };
 };
};

// Example:
// {
//  data: {
//   type: 'analysis';
//   id: 'u-24764515a930e49bfe7ca29f08a3460cc66fd2ab103144e4fa300658f3315ba8-1699698398';
//   links: {
//    self: 'https://www.virustotal.com/api/v3/analyses/u-24764515a930e49bfe7ca29f08a3460cc66fd2ab103144e4fa300658f3315ba8-1699698398';
//   };
//  };
// };

type VirusTotalAnalyses = {
 meta: {
  url_info: {
   url: string;
   id: string;
  };
 };
 data: {
  attributes: {
   date: number; // Unix timestamp
   status: 'queued' | 'completed' | 'in-progress';
   stats: {
    harmless: number;
    malicious: number;
    suspicious: number;
    undetected: number;
    timeout: number;
   };
   results: {
    [key: string]: {
     category: 'undetected' | 'harmless' | 'malicious' | 'suspicious';
     result: 'unrated' | 'clean' | 'phishing' | 'malicious';
     method: 'blacklist';
     engine_name: string;
    };
   };
  };
  type: 'analysis';
  id: string;
  links: {
   item: string;
   self: string;
  };
 };
};

// Example: {
//  meta: {
//   url_info: {
//    url: 'http://example.com/';
//    id: '24764515a930e49bfe7ca29f08a3460cc66fd2ab103144e4fa300658f3315ba8';
//   };
//  };
//  data: {
//   attributes: {
//    date: 1699698398;
//    status: 'completed';
//    stats: {
//     harmless: 58;
//     malicious: 16;
//     suspicious: 0;
//     undetected: 16;
//     timeout: 0;
//    };
//    results: {
//     Kaspersky: {
//      category: 'malicious';
//      result: 'phishing';
//      method: 'blacklist';
//      engine_name: 'Kaspersky';
//     };
//    };
//   };
//   type: 'analysis';
//   id: 'u-24764515a930e49bfe7ca29f08a3460cc66fd2ab103144e4fa300658f3315ba8-1699698398';
//   links: {
//    item: 'https://www.virustotal.com/api/v3/urls/24764515a930e49bfe7ca29f08a3460cc66fd2ab103144e4fa300658f3315ba8';
//    self: 'https://www.virustotal.com/api/v3/analyses/u-24764515a930e49bfe7ca29f08a3460cc66fd2ab103144e4fa300658f3315ba8-1699698398';
//   };
//  };
// };
