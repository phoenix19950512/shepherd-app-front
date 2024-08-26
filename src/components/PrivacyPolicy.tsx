import React from 'react';
import { Box, Heading, Text, UnorderedList, ListItem } from '@chakra-ui/react';

function PrivacyPolicy() {
  return (
    <Box overflowY={'auto'} h="75vh" className="tandc custom-scroll">
      <Text>
        This Application collects some Personal Data from its Users. This
        document can be printed for reference by using the print command in the
        settings of any browser.
      </Text>
      <Box mt="4">
        <Text>
          <strong>Owner and Data Controller:</strong>
          <br />
          Shepherd Learn, Inc.
          <br />
          1035 W. Van Buren Street
          <br />
          Chicago, IL, 60607
          <br />
          Owner contact email:{' '}
          <a href="mailto:hello@shepherd.study">hello@shepherd.study</a>
        </Text>
      </Box>
      <Box mt="4">
        <Text>
          <strong>Types of Data collected:</strong>
          <br />
          Among the types of Personal Data that this Application collects, by
          itself or through third parties, there are: Trackers; first name; last
          name; username; IP address; device information; browser information;
          email address; city; state; province; country; page views; clicks;
          browsing history; Data communicated while using the service; Usage
          Data; password; picture; User ID; academic background; billing
          address.
        </Text>
        <Text mt="2">
          Complete details on each type of Personal Data collected are provided
          in the dedicated sections of this privacy policy or by specific
          explanation texts displayed prior to the Data collection.
        </Text>
      </Box>
      <Box mt="4">
        <Text>
          Unless specified otherwise, all Data requested by this Application is
          mandatory and failure to provide this Data may make it impossible for
          this Application to provide its services. In cases where this
          Application specifically states that some Data is not mandatory, Users
          are free not to communicate this Data without consequences to the
          availability or the functioning of the Service.
        </Text>
        <Text mt="2">
          Users who are uncertain about which Personal Data is mandatory are
          welcome to contact the Owner.
        </Text>
      </Box>
      <Box mt="4">
        <Text>
          Any use of Cookies – or of other tracking tools — by this Application
          or by the owners of third-party services used by this Application
          serves the purpose of providing the Service required by the User, in
          addition to any other purposes described in the present document and
          in the Cookie Policy.
        </Text>
      </Box>
      <Box mt="4">
        <Text>
          Users are responsible for any third-party Personal Data obtained,
          published or shared through this Application.
        </Text>
      </Box>
      <Box mt="4">
        <Text>
          <strong>
            Mode and place of processing the Data Methods of processing:
          </strong>
          <br />
          The Owner takes appropriate security measures to prevent unauthorized
          access, disclosure, modification, or unauthorized destruction of the
          Data.
        </Text>
        <Text mt="2">
          The Data processing is carried out using computers and/or IT enabled
          tools, following organizational procedures and modes strictly related
          to the purposes indicated. In addition to the Owner, in some cases,
          the Data may be accessible to certain types of persons in charge,
          involved with the operation of this Application (administration,
          sales, marketing, legal, system administration) or external parties
          (such as third-party technical service providers, mail carriers,
          hosting providers, IT companies, communications agencies) appointed,
          if necessary, as Data Processors by the Owner. The updated list of
          these parties may be requested from the Owner at any time.
        </Text>
      </Box>
      <Text fontSize="md" fontWeight="semibold" my={2}>
        Place
      </Text>
      <Text>
        The Data is processed at the Owner's operating offices and in any other
        places where the parties involved in the processing are located.
      </Text>
      <Text mt="4">
        Depending on the User's location, data transfers may involve
        transferring the User's Data to a country other than their own. To find
        out more about the place of processing of such transferred Data, Users
        can check the section containing details about the processing of
        Personal Data.
      </Text>
      <Text fontSize="md" fontWeight="semibold" my={2}>
        Retention time
      </Text>
      <Text>
        Unless specified otherwise in this document, Personal Data shall be
        processed and stored for as long as required by the purpose they have
        been collected for and may be retained for longer due to applicable
        legal obligation or based on the Users’ consent.
      </Text>
      <Heading as="h3" fontSize="lg" fontWeight="bold" mb={4}>
        The purposes of processing
      </Heading>
      <Text>
        The Data concerning the User is collected to allow the Owner to provide
        its Service, comply with its legal obligations, respond to enforcement
        requests, protect its rights and interests (or those of its Users or
        third parties), detect any malicious or fraudulent activity, as well as
        the following: Analytics, Hosting and backend infrastructure, Displaying
        content from external platforms and Registration and authentication
        provided directly by this Application.
      </Text>
      <Text mt="4">
        For specific information about the Personal Data used for each purpose,
        the User may refer to the section “Detailed information on the
        processing of Personal Data”.
      </Text>
      <Heading as="h3" fontSize="lg" fontWeight="bold" mb={4}>
        Detailed information on the processing of Personal Data
      </Heading>
      <Text>
        Personal Data is collected for the following purposes and using the
        following services:
      </Text>
      <UnorderedList>
        <ListItem>
          {' '}
          <Text fontSize="md" fontWeight="semibold" my={2}>
            Analytics
          </Text>
          <Text>
            The services contained in this section enable the Owner to monitor
            and analyze web traffic and can be used to keep track of User
            behavior.
          </Text>
          <Text fontWeight={'semibold'}>
            PostHog product analytics (PostHog, Inc.)
          </Text>
          <Text>
            PostHog product analytics is an analytics service provided by
            PostHog, Inc. that gives the Owner insight into the use of this
            Application by Users.
          </Text>
          <Text mt="2">
            <strong>Personal Data processed:</strong> browser information;
            browsing history; city; clicks; country; device information; email
            address; first name; IP address; last name; page views; province;
            state; Trackers; username.
          </Text>
          <Text mt="2">
            <strong>Place of processing:</strong>{' '}
            <a href="https://posthog.com/privacy" color="blue.500">
              United States – Privacy Policy
            </a>
          </Text>
        </ListItem>
        <ListItem>
          <Text fontSize="md" fontWeight="semibold" my={2}>
            Displaying content from external platforms
          </Text>
          <Text>
            This type of service allows you to view content hosted on external
            platforms directly from the pages of this Application and interact
            with them. Such services are often referred to as widgets, which are
            small elements placed on a website or app. They provide specific
            information or perform a particular function and often allow for
            user interaction.
          </Text>
          <Text mt="2">
            <strong>Google Fonts (Google LLC)</strong>
          </Text>
          <Text>
            Google Fonts is a typeface visualization service provided by Google
            LLC that allows this Application to incorporate content of this kind
            on its pages.
          </Text>
          <Text mt="2">
            <strong>Personal Data processed:</strong> Trackers; Usage Data.
          </Text>
          <Text mt="2">
            <strong>Place of processing:</strong>{' '}
            <a href="https://policies.google.com/privacy" color="blue.500">
              United States – Privacy Policy
            </a>
          </Text>
        </ListItem>
        <ListItem>
          {' '}
          <Text fontSize="md" fontWeight="semibold" my={2}>
            Hosting and backend infrastructure
          </Text>
          <Text>
            This type of service has the purpose of hosting Data and files that
            enable this Application to run and be distributed as well as to
            provide a ready-made infrastructure to run specific features or
            parts of this Application.
          </Text>
          <Text mt="2">
            <strong>Netlify (Netlify, Inc.)</strong>
          </Text>
          <Text>Netlify is a hosting service provided by Netlify, Inc.</Text>
          <Text mt="2">
            <strong>Personal Data processed:</strong> Data communicated while
            using the service.
          </Text>
          <Text mt="2">
            <strong>Place of processing:</strong>{' '}
            <a href="https://www.netlify.com/privacy/" color="blue.500">
              United States – Privacy Policy
            </a>
          </Text>
        </ListItem>
        <ListItem>
          {' '}
          <Text fontSize="md" fontWeight="semibold" my={2}>
            Registration and authentication provided directly by this
            Application
          </Text>
          <Text>
            By registering or authenticating, Users allow this Application to
            identify them and give them access to dedicated services. The
            Personal Data is collected and stored for registration or
            identification purposes only. The Data collected are only those
            necessary for the provision of the service requested by the Users.
          </Text>
          <Text mt="2">
            <strong>Direct registration (this Application)</strong>
          </Text>
          <Text>
            The User registers by filling out the registration form and
            providing the Personal Data directly to this Application.
          </Text>
          <Text mt="2">
            <strong>Personal Data processed:</strong> academic background;
            billing address; city; country; email address; first name; last
            name; password; picture; User ID.
          </Text>
        </ListItem>
      </UnorderedList>

      <Heading as="h3" size="md" mt="8" mb="2">
        Cookie Policy
      </Heading>
      <Text>
        This Application uses Trackers. To learn more, Users may consult the
        Cookie Policy.
      </Text>
      <Text fontSize="md" fontWeight="semibold" my={2}>
        Further Information for Users
      </Text>
      <Text fontSize="md" fontWeight="semibold" my={2}>
        Legal Basis for Data Processing
      </Text>
      <Text>
        The Owner may process Personal Data relating to Users if one of the
        following applies:
      </Text>
      <UnorderedList>
        <ListItem>
          Users have given their consent for one or more specific purposes.
        </ListItem>
        <ListItem>
          Provision of Data is necessary for the performance of an agreement
          with the User and/or for any pre-contractual obligations thereof.
        </ListItem>
        <ListItem>
          Processing is necessary for compliance with a legal obligation to
          which the Owner is subject.
        </ListItem>
        <ListItem>
          Processing is related to a task that is carried out in the public
          interest or in the exercise of official authority vested in the Owner.
        </ListItem>
        <ListItem>
          Processing is necessary for the purposes of the legitimate interests
          pursued by the Owner or by a third party.
        </ListItem>
      </UnorderedList>
      <Text mt="4">
        In any case, the Owner will gladly help to clarify the specific legal
        basis that applies to the processing, and in particular whether the
        provision of Personal Data is a statutory or contractual requirement, or
        a requirement necessary to enter into a contract.
      </Text>
      <Text fontSize="md" fontWeight="semibold" my={2}>
        Further Information about Retention Time
      </Text>
      <Text>
        Unless specified otherwise in this document, Personal Data shall be
        processed and stored for as long as required by the purpose they have
        been collected for and may be retained for longer due to applicable
        legal obligation or based on the Users’ consent.
      </Text>
      <Text mt="4">Therefore:</Text>
      <UnorderedList>
        <ListItem>
          Personal Data collected for purposes related to the performance of a
          contract between the Owner and the User shall be retained until such
          contract has been fully performed.
        </ListItem>
        <ListItem>
          Personal Data collected for the purposes of the Owner’s legitimate
          interests shall be retained as long as needed to fulfill such
          purposes. Users may find specific information regarding the legitimate
          interests pursued by the Owner within the relevant sections of this
          document or by contacting the Owner.
        </ListItem>
      </UnorderedList>
      <Text>
        The Owner may be allowed to retain Personal Data for a longer period
        whenever the User has given consent to such processing, as long as such
        consent is not withdrawn. Furthermore, the Owner may be obliged to
        retain Personal Data for a longer period whenever required to fulfil a
        legal obligation or upon order of an authority.
      </Text>
      <Text>
        Once the retention period expires, Personal Data shall be deleted.
        Therefore, the right of access, the right to erasure, the right to
        rectification, and the right to data portability cannot be enforced
        after expiration of the retention period.
      </Text>
      <Text fontSize="md" fontWeight="semibold" my={2}>
        The rights of Users based on the General Data Protection Regulation
        (GDPR)
      </Text>
      <Text>
        Users may exercise certain rights regarding their Data processed by the
        Owner.
      </Text>
      <Text mt="4">
        In particular, Users have the right to do the following, to the extent
        permitted by law:
      </Text>
      <UnorderedList>
        <ListItem>
          Withdraw their consent at any time. Users have the right to withdraw
          consent where they have previously given their consent to the
          processing of their Personal Data.
        </ListItem>
        <ListItem>
          Object to processing of their Data. Users have the right to object to
          the processing of their Data if the processing is carried out on a
          legal basis other than consent.
        </ListItem>
        <ListItem>
          Access their Data. Users have the right to learn if Data is being
          processed by the Owner, obtain disclosure regarding certain aspects of
          the processing, and obtain a copy of the Data undergoing processing.
        </ListItem>
        <ListItem>
          Verify and seek rectification. Users have the right to verify the
          accuracy of their Data and ask for it to be updated or corrected.
        </ListItem>
        <ListItem>
          Restrict the processing of their Data. Users have the right to
          restrict the processing of their Data. In this case, the Owner will
          not process their Data for any purpose other than storing it.
        </ListItem>
        <ListItem>
          Have their Personal Data deleted or otherwise removed. Users have the
          right to obtain the erasure of their Data from the Owner.
        </ListItem>
        <ListItem>
          Receive their Data and have it transferred to another controller.
          Users have the right to receive their Data in a structured, commonly
          used and machine-readable format and, if technically feasible, to have
          it transmitted to another controller without any hindrance.
        </ListItem>
        <ListItem>
          Lodge a complaint. Users have the right to bring a claim before their
          competent data protection authority.
        </ListItem>
      </UnorderedList>
      <Text>
        Users are also entitled to learn about the legal basis for Data
        transfers abroad including to any international organization governed by
        public international law or set up by two or more countries, such as the
        UN, and about the security measures taken by the Owner to safeguard
        their Data.
      </Text>
      <Text fontWeight={'semibold'}>
        Details about the right to object to processing
      </Text>
      <Text fontWeight={'semibold'}>
        Where Personal Data is processed for a public interest, in the exercise
        of an official authority vested in the Owner or for the purposes of the
        legitimate interests pursued by the Owner, Users may object to such
        processing by providing a ground related to their particular situation
        to justify the objection.
      </Text>
      <Text fontWeight={'semibold'}>
        Users must know that, however, should their Personal Data be processed
        for direct marketing purposes, they can object to that processing at any
        time, free of charge and without providing any justification. Where the
        User objects to processing for direct marketing purposes, the Personal
        Data will no longer be processed for such purposes. To learn whether the
        Owner is processing Personal Data for direct marketing purposes, Users
        may refer to the relevant sections of this document.
      </Text>
      <Text fontWeight={'semibold'}>How to exercise these rights</Text>
      <Text>
        Any requests to exercise User rights can be directed to the Owner
        through the contact details provided in this document. Such requests are
        free of charge and will be answered by the Owner as early as possible
        and always within one month, providing Users with the information
        required by law. Any rectification or erasure of Personal Data or
        restriction of processing will be communicated by the Owner to each
        recipient, if any, to whom the Personal Data has been disclosed unless
        this proves impossible or involves disproportionate effort. At the
        Users’ request, the Owner will inform them about those recipients.
      </Text>
      <Heading as="h3" size="md" mt="8" mb="2">
        Additional information about Data collection and processing Legal action
      </Heading>
      <Text fontSize="md" fontWeight="semibold" my={2}>
        Legal action
      </Text>
      <Text>
        The User's Personal Data may be used for legal purposes by the Owner in
        Court or in the stages leading to possible legal action arising from
        improper use of this Application or the related Services.
      </Text>
      <Text mt="4">
        The User declares to be aware that the Owner may be required to reveal
        personal data upon request of public authorities.
      </Text>
      <Text fontSize="md" fontWeight="semibold" my={2}>
        Additional information about User's Personal Data
      </Text>
      <Text>
        In addition to the information contained in this privacy policy, this
        Application may provide the User with additional and contextual
        information concerning particular Services or the collection and
        processing of Personal Data upon request.
      </Text>
      <Text fontSize="md" fontWeight="semibold" my={2}>
        System logs and maintenance
      </Text>
      <Text>
        For operation and maintenance purposes, this Application and any
        third-party services may collect files that record interaction with this
        Application (System logs) or use other Personal Data (such as the IP
        Address) for this purpose.
      </Text>
      <Text fontSize="md" fontWeight="semibold" my={2}>
        Information not contained in this policy
      </Text>
      <Text>
        More details concerning the collection or processing of Personal Data
        may be requested from the Owner at any time. Please see the contact
        information at the beginning of this document.
      </Text>
      <Text fontSize="md" fontWeight="semibold" my={2}>
        Changes to this privacy policy
      </Text>
      <Text>
        The Owner reserves the right to make changes to this privacy policy at
        any time by notifying its Users on this page and possibly within this
        Application and/or - as far as technically and legally feasible -
        sending a notice to Users via any contact information available to the
        Owner. It is strongly recommended to check this page often, referring to
        the date of the last modification listed at the bottom.
      </Text>
      <Text mt="4">
        Should the changes affect processing activities performed on the basis
        of the User’s consent, the Owner shall collect new consent from the
        User, where required.
      </Text>
      <Text fontSize="md" fontWeight="semibold" my={2}>
        Definitions and legal references
      </Text>
      <Text fontWeight="semibold">Personal Data (or Data)</Text>
      <Text>
        Any information that directly, indirectly, or in connection with other
        information — including a personal identification number — allows for
        the identification or identifiability of a natural person.
      </Text>
      <Text fontWeight="semibold">Usage Data</Text>
      <Text mt="4">
        Information collected automatically through this Application (or
        third-party services employed in this Application), which can include:
        the IP addresses or domain names of the computers utilized by the Users
        who use this Application, the URI addresses (Uniform Resource
        Identifier), the time of the request, the method utilized to submit the
        request to the server, the size of the file received in response, the
        numerical code indicating the status of the server's answer (successful
        outcome, error, etc.), the country of origin, the features of the
        browser and the operating system utilized by the User, the various time
        details per visit (e.g., the time spent on each page within the
        Application) and the details about the path followed within the
        Application with special reference to the sequence of pages visited, and
        other parameters about the device operating system and/or the User's IT
        environment.
      </Text>
      <Text fontWeight="semibold">User</Text>
      <Text>
        The individual using this Application who, unless otherwise specified,
        coincides with the Data Subject.
      </Text>
      <Text fontWeight="semibold">Data Subject</Text>
      <Text>The natural person to whom the Personal Data refers.</Text>
      <Text fontWeight="semibold">Data Processor (or Processor)</Text>
      <Text>
        The natural or legal person, public authority, agency, or other body
        which processes Personal Data on behalf of the Controller, as described
        in this privacy policy.
      </Text>
      <Text fontWeight="semibold">Data Controller (or Owner)</Text>
      <Text>
        The natural or legal person, public authority, agency, or other body
        which, alone or jointly with others, determines the purposes and means
        of the processing of Personal Data, including the security measures
        concerning the operation and use of this Application. The Data
        Controller, unless otherwise specified, is the Owner of this
        Application.
      </Text>
      <Text fontWeight="semibold">This Application</Text>
      <Text>
        The means by which the Personal Data of the User is collected and
        processed.
      </Text>
      <Text fontWeight="semibold">Service</Text>
      <Text>
        The service provided by this Application as described in the relative
        terms (if available) and on this site/application.
      </Text>
      <Text fontWeight="semibold">European Union (or EU)</Text>
      <Text>
        Unless otherwise specified, all references made within this document to
        the European Union include all current member states to the European
        Union and the European Economic Area.
      </Text>
      <Text fontWeight="semibold">Cookie</Text>
      <Text>
        Cookies are Trackers consisting of small sets of data stored in the
        User's browser.
      </Text>
      <Text fontWeight="semibold">Tracker</Text>
      <Text>
        Tracker indicates any technology - e.g Cookies, unique identifiers, web
        beacons, embedded scripts, e-tags and fingerprinting - that enables the
        tracking of Users, for example by accessing or storing information on
        the User’s device.
      </Text>
    </Box>
  );
}

export default PrivacyPolicy;
