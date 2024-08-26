import React from 'react';
import { Box, Heading, Text, UnorderedList, ListItem } from '@chakra-ui/react';

function TandC() {
  return (
    <Box overflowY={'auto'} h="75vh" className="tandc custom-scroll">
      {/* <Heading as="h1" size="xl" mb={4}>
      Terms and Conditions of www.shepherd.study
    </Heading> */}
      <Text mb={4}>
        These Terms govern <br />
        <UnorderedList mb={4}>
          <ListItem>the use of this Application, and,</ListItem>
          <ListItem>
            any other related Agreement or legal relationship with the Owner
          </ListItem>
        </UnorderedList>
        in a legally binding way. Capitalized words are defined in the relevant
        dedicated section of this document.
      </Text>
      <Text mb={4}>The User must read this document carefully.</Text>
      <Text mb={4}>
        Although the entire contractual relationship relating to these Products
        is entered into solely by the Owner and Users, Users acknowledge and
        agree that, where this Application has been provided to them via the
        Apple App Store, Apple may enforce these Terms as a third-party
        beneficiary.
      </Text>
      <Text mb={4}>This Application is provided by:</Text>
      <Text mb={4}>
        Shepherd Learn, Inc. 1035 W. Van Buren Street Chicago, IL, 60607
      </Text>
      <Text mb={4}>
        Owner contact email:{' '}
        <a href="mailto:hello@shepherd.study">hello@shepherd.study</a>
      </Text>
      <Heading as="h3" fontSize="lg" fontWeight="bold" mb={4}>
        What the User should know at a glance
      </Heading>
      <UnorderedList mb={4}>
        <ListItem>
          <Text mb={4}>
            Please note that some provisions in these Terms may only apply to
            certain categories of Users. In particular, certain provisions may
            only apply to Consumers or to those Users that do not qualify as
            Consumers. Such limitations are always explicitly mentioned within
            each affected clause. In the absence of any such mention, clauses
            apply to all Users.
          </Text>
        </ListItem>
        <ListItem>
          <Text mb={4}>
            The right of withdrawal only applies to European Consumers.
          </Text>
        </ListItem>
        <ListItem>
          <Text mb={4}>
            This Application uses automatic renewal for Product subscriptions.
            Information about the a) renewal period, b) termination details and
            c) termination notice can be found in the relevant section of these
            Terms.
          </Text>
        </ListItem>
        <ListItem>
          <Text mb={4}>
            Important: Consumers based in Germany have different rules applying
            to them as described in the relevant section of these Terms.
          </Text>
        </ListItem>
      </UnorderedList>
      <Heading as="h3" fontSize="lg" fontWeight="bold" mb={4}>
        How this Application works
      </Heading>
      <Text mb={4}>
        This Application merely serves as a technical infrastructure or platform
        to allow Users to interact with each other. The Owner therefore is not
        directly involved in any such interactions between Users.
      </Text>
      <Heading as="h3" fontSize="lg" fontWeight="bold" mb={4}>
        TERMS OF USE
      </Heading>
      <Text mb={4}>
        Unless otherwise specified, the terms of use detailed in this section
        apply generally when using this Application.
      </Text>
      <Text mb={4}>
        Single or additional conditions of use or access may apply in specific
        scenarios and in such cases are additionally indicated within this
        document.
      </Text>
      <Text mb={4}>
        By using this Application, Users confirm to meet the following
        requirements:
      </Text>
      <UnorderedList>
        <ListItem>
          <Text mb={4}>
            There are no restrictions for Users in terms of being Consumers or
            Business Users;
          </Text>
        </ListItem>
        <ListItem>
          <Text mb={4}>Users must be older than 13;</Text>
        </ListItem>
        <ListItem>
          <Text mb={4}>
            Users aren’t located in a country that is subject to a U.S.
            Government embargo, or that has been designated by the U.S.
            Government as a “terrorist-supporting” country;
          </Text>
        </ListItem>
        <ListItem>
          <Text mb={4}>
            Users aren’t listed on any U.S. Government list of prohibited or
            restricted parties;
          </Text>
        </ListItem>
      </UnorderedList>
      <Text fontSize="md" fontWeight="semibold" my={2}>
        Account registration
      </Text>
      <Text>
        To use the Service Users must register or create a User account,
        providing all required data or information in a complete and truthful
        manner.
      </Text>
      <Text>Failure to do so will cause unavailability of the Service.</Text>
      <Text>
        Users are responsible for keeping their login credentials confidential
        and safe. For this reason, Users are also required to choose passwords
        that meet the highest standards of strength permitted by this
        Application.
      </Text>
      <Text>
        By registering, Users agree to be fully responsible for all activities
        that occur under their username and password.
      </Text>
      <Text>
        Users are required to immediately and unambiguously inform the Owner via
        the contact details indicated in this document if they think their
        personal information, including but not limited to User accounts, access
        credentials, or personal data, have been violated, unduly disclosed, or
        stolen.
      </Text>
      <Text fontWeight={'semibold'} my={2}>
        Account termination
      </Text>
      <Text>
        Users can terminate their account and stop using the Service at any time
        by doing the following:
      </Text>
      <UnorderedList my={4}>
        <ListItem>
          {' '}
          By directly contacting the Owner at the contact details provided in
          this document.
        </ListItem>
      </UnorderedList>
      <Text fontWeight={'semibold'} my={2}>
        Account suspension and deletion
      </Text>
      <Text>
        The Owner reserves the right, at its sole discretion, to suspend or
        delete at any time and without notice, User accounts that it deems
        inappropriate, offensive, or in violation of these Terms.
      </Text>
      <Text my={2}>
        The suspension or deletion of User accounts shall not entitle Users to
        any claims for compensation, damages, or reimbursement.
      </Text>
      <Text my={2}>
        The suspension or deletion of accounts due to causes attributable to the
        User does not exempt the User from paying any applicable fees or prices.
      </Text>
      <Text fontSize="md" fontWeight="semibold" my={2}>
        Content on this Application
      </Text>
      <Text my={2}>
        Unless where otherwise specified or clearly recognizable, all content
        available on this Application is owned or provided by the Owner or its
        licensors.
      </Text>
      <Text>
        The Owner undertakes its utmost effort to ensure that the content
        provided on this Application infringes no applicable legal provisions or
        third-party rights. However, it may not always be possible to achieve
        such a result. In such cases, without prejudice to any legal
        prerogatives of Users to enforce their rights, Users are kindly asked to
        preferably report related complaints using the contact details provided
        in this document.
      </Text>
      <Text fontWeight={'semibold'}>
        Rights regarding content on this Application - All rights reserved
      </Text>
      <Text pt={2}>
        The Owner holds and reserves all intellectual property rights for any
        such content.
      </Text>
      <Text>
        Users may not, therefore, use such content in any way that is not
        necessary or implicit in the proper use of the Service.
      </Text>
      <Text>
        In particular, but without limitation, Users may not copy, download,
        share (beyond the limits set forth below), modify, translate, transform,
        publish, transmit, sell, sublicense, edit, transfer/assign to third
        parties, or create derivative works from the content available on this
        Application, nor allow any third party to do so through the User or
        their device, even without the User's knowledge.
      </Text>
      <Text>
        Where explicitly stated on this Application, the User may download,
        copy, and/or share some content available through this Application for
        its sole personal and non-commercial use and provided that the copyright
        attributions and all the other attributions requested by the Owner are
        correctly implemented. Any applicable statutory limitation or exception
        to copyright shall stay unaffected.
      </Text>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Content provided by Users
      </Text>
      <Text>
        The Owner allows Users to upload, share, or provide their own content to
        this Application.
      </Text>
      <Text>
        By providing content to this Application, Users confirm that they are
        legally allowed to do so and that they are not infringing any statutory
        provisions and/or third-party rights.
      </Text>
      <Text>
        Further insights regarding acceptable content can be found inside the
        respective section on this Application which details the acceptable
        uses.
      </Text>
      <Text>
        Users acknowledge and accept that by providing their own content to this
        Application they grant the Owner a non-exclusive, worldwide, fully
        paid-up and royalty-free, irrevocable, perpetual (or for the entire
        protection term), sub-licensable and transferable license to use,
        access, store, reproduce, modify, distribute, publish, process into
        derivative works, broadcast, stream, transmit, or otherwise exploit such
        content to provide and promote its Service in any media or manner.
      </Text>
      <Text>
        To the extent permitted by applicable law, Users waive any moral rights
        in connection with content they provide to this Application.
      </Text>
      <Text>
        Users acknowledge, accept, and confirm that all content they provide
        through this Application is provided subject to the same general
        conditions set forth for content on this Application.
      </Text>
      <Text>
        Users are solely liable for any content they upload, post, share, or
        provide through this Application.
      </Text>
      <Text>
        Users acknowledge and accept that the Owner filters or moderates such
        content after it has been made available.
      </Text>
      <Text>
        Therefore, the Owner reserves the right to refuse, remove, delete, or
        block such content at its own discretion and to deny access to this
        Application to the uploading User without prior notice if it considers
        such content to infringe these Terms, any applicable legal provision, or
        third-party right, or to otherwise represent a risk for Users, third
        parties, the Owner, and/or the availability of the Service.
      </Text>
      <Text>
        The removal, deletion, or blocking of content shall not entitle Users
        that have provided such content or that are liable for it to any claims
        for compensation, damages, or reimbursement.
      </Text>
      <Text>
        Users agree to hold the Owner harmless from and against any claim
        asserted and/or damage suffered due to content they provided to or
        provided through this Application.
      </Text>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Access to external resources
      </Text>
      <Text pt={2}>
        Through this Application Users may have access to external resources
        provided by third parties. Users acknowledge and accept that the Owner
        has no control over such resources and is therefore not responsible for
        their content and availability.
      </Text>
      <Text>
        Conditions applicable to any resources provided by third parties,
        including those applicable to any possible grant of rights in content,
        result from each such third party's terms and conditions or, in the
        absence of those, applicable statutory law.
      </Text>
      <Text>
        In particular, on this Application Users may see advertisements provided
        by third parties. The Owner does not control or moderate the
        advertisements displayed via this Application. If Users click on any
        such advertisement, they will be interacting with any third party
        responsible for that advertisement.
      </Text>
      <Text>
        The Owner is not responsible for any matters resulting from such
        interaction with third parties, such as anything resulting from visiting
        third-party websites or using third-party content.
      </Text>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Acceptable use
      </Text>
      <Text>
        This Application and the Service may only be used within the scope of
        what they are provided for, under these Terms and applicable law.
      </Text>
      <Text>
        Users are solely responsible for making sure that their use of this
        Application and/or the Service violates no applicable law, regulations,
        or third-party rights.
      </Text>
      <Text>
        Therefore,{' '}
        <b>
          the Owner reserves the right to take any appropriate measure to
          protect its legitimate interests including by denying Users access to
          this Application or the Service, terminating contracts, reporting any
          misconduct performed through this Application or the Service to the
          competent authorities – such as judicial or administrative authorities
          - whenever Users engage or are suspected to engage in any of the
          following activities:
        </b>
      </Text>
      <UnorderedList mb={4}>
        <ListItem>violate laws, regulations and/or these Terms;</ListItem>
        <ListItem>infringe any third-party rights;</ListItem>
        <ListItem>
          considerably impair the Owner’s legitimate interests;
        </ListItem>
        <ListItem>offend the Owner or any third party.</ListItem>
      </UnorderedList>
      <Text fontSize="md" fontWeight="semibold">
        “Tell-a-friend”
      </Text>
      <Text>
        This Application gives Users the opportunity to receive advantages if,
        as a result of their recommendation, any new User purchases a Product
        offered on this Application.
      </Text>
      <Text>
        In order to take advantage of this offer, Users may invite others to
        purchase the Products on this Application by sending them a
        tell-a-friend code provided by the Owner. Such codes can only be
        redeemed once.
      </Text>
      <Text>
        If upon purchase of the Products on this Application any of the persons
        invited redeems a tell-a-friend code, the inviting User shall receive
        the advantage or benefit (such as: a price reduction, an additional
        service feature, an upgrade etc.) specified on this Application.
      </Text>
      <Text>
        Tell-a-friend codes may be limited to specific Products among those
        offered on this Application.
      </Text>
      <Text>
        The Owner reserves the right to end the offer at any time at its own
        discretion.
      </Text>
      <Text>
        While no general limitation applies to the number of persons that can be
        invited, the amount of advantage or benefit that each inviting User can
        receive, may be limited.
      </Text>
      <Heading as="h3" fontSize="lg" fontWeight="bold" mb={4}>
        TERMS AND CONDITIONS OF SALE
      </Heading>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Provision of personal data
      </Text>
      <Text pt={2}>
        To access or receive some of the Products provided via this Application
        as part of the Service, Users may be required to provide their personal
        data as indicated on this Application.
      </Text>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Paid Products
      </Text>
      <Text>
        Some of the Products provided on this Application, as part of the
        Service, are provided on the basis of payment.
      </Text>
      <Text>
        The fees, duration and conditions applicable to the purchase of such
        Products are described below and in the dedicated sections of this
        Application.
      </Text>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Product description
      </Text>
      <Text>
        Prices, descriptions or availability of Products are outlined in the
        respective sections of this Application and are subject to change
        without notice.
      </Text>
      <Text>
        While Products on this Application are presented with the greatest
        accuracy technically possible, representation on this Application
        through any means (including, as the case may be, graphic material,
        images, colors, sounds) is for reference only and implies no warranty as
        to the characteristics of the purchased Product.
      </Text>
      <Text>
        The characteristics of the chosen Product will be outlined during the
        purchasing process.
      </Text>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Purchasing process
      </Text>
      <Text>
        Any steps taken from choosing a Product to order submission form part of
        the purchasing process. The purchasing process includes these steps:
      </Text>
      <UnorderedList mb={4}>
        <ListItem>
          Users must choose the desired Product and verify their purchase
          selection.
        </ListItem>
        <ListItem>
          After having reviewed the information displayed in the purchase
          selection, Users may place the order by submitting it.{' '}
        </ListItem>
      </UnorderedList>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Order submission
      </Text>
      <Text>When the User submits an order, the following applies:</Text>
      <UnorderedList mb={4}>
        <ListItem>
          The submission of an order determines contract conclusion and
          therefore creates for the User the obligation to pay the price, taxes
          and possible further fees and expenses, as specified on the order
          page.
        </ListItem>
        <ListItem>
          In case the purchased Product requires an action from the User, such
          as the provision of personal information or data, specifications or
          special wishes, the order submission creates an obligation for the
          User to cooperate accordingly.{' '}
        </ListItem>
        <ListItem>
          Upon submission of the order, Users will receive a receipt confirming
          that the order has been received.
        </ListItem>
      </UnorderedList>{' '}
      <Text>
        All notifications related to the described purchasing process shall be
        sent to the email address provided by the User for such purposes.
      </Text>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Prices
      </Text>
      <Text>
        Users are informed during the purchasing process and before order
        submission, about any fees, taxes and costs (including, if any, delivery
        costs) that they will be charged.
      </Text>
      <Text>Prices on this Application are displayed:</Text>
      <UnorderedList mb={4}>
        <ListItem>
          either exclusive or inclusive of any applicable fees, taxes and costs,
          depending on the section the User is browsing.
        </ListItem>
      </UnorderedList>
      <Text pl={35}></Text>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Offers and discounts
      </Text>
      <Text>
        The Owner or any Seller may offer discounts or provide special offers
        for the purchase of Products. Any such offer or discount shall always be
        subject to the eligibility criteria and the terms and conditions set out
        in the corresponding section of this Application.
      </Text>
      <Text>
        Offers and discounts are always granted at the Owner’s or Seller’s sole
        discretion. Repeated or recurring offers or discounts create no
        claim/title or right that Users may enforce in the future. Depending on
        the case, discounts or offers shall be valid for a limited time only or
        while stocks last.
      </Text>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Methods of payment
      </Text>
      <Text>
        Information related to accepted payment methods is made available during
        the purchasing process.
      </Text>
      <Text>
        Some payment methods may only be available subject to additional
        conditions or fees. In such cases related information can be found in
        the dedicated section of this Application.
      </Text>
      <Text>
        All payments are independently processed through third-party services.
        Therefore, this Application does not collect any payment information –
        such as credit card details – but only receives a notification once the
        payment has been successfully completed.
      </Text>
      <Text>
        If a payment through the available methods fails or is refused by the
        payment service provider, the Owner shall be under no obligation to
        fulfill the purchase order. If a payment fails or is refused, the Owner
        reserves the right to claim any related expenses or damages from the
        User.
      </Text>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Retention of usage rights
      </Text>
      <Text>
        Users do not acquire any rights to use the purchased Product until the
        total purchase price is received by the Owner.
      </Text>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Delivery
      </Text>
      <Text fontWeight={'semibold'}>Performance of services</Text>
      <Text>
        The purchased service shall be performed or made available within the
        timeframe specified on this Application or as communicated before the
        order submission.
      </Text>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Contract duration
      </Text>
      <Text fontWeight={'semibold'}>Trial period</Text>
      <Text>
        Users have the option to test this Application or selected Products
        during a limited and non-renewable trial period, at no cost. Some
        features or functions of this Application may not be available to Users
        during the trial period.
      </Text>
      <Text>
        Further conditions applicable to the trial period, including its
        duration, will be specified on this Application.
      </Text>
      <Text>
        The trial period shall end automatically and shall not convert into any
        paid Product unless the User actively purchases such paid Product.
      </Text>
      <Text fontWeight={'semibold'}>Subscriptions</Text>
      <Text>
        Subscriptions allow Users to receive a Product continuously or regularly
        over time. Details regarding the type of subscription and termination
        are outlined below.
      </Text>
      <Text fontWeight={'semibold'}>Fixed-term subscriptions</Text>
      <Text>
        Paid fixed-term subscriptions start on the day the payment is received
        by the Owner and last for the subscription period chosen by the User or
        otherwise specified during the purchasing process.
      </Text>
      <Text>
        Once the subscription period expires, the Product shall no longer be
        accessible.
      </Text>
      <Text fontWeight={'semibold'}>
        Automatic renewal of fixed-term subscriptions
      </Text>
      <Text fontWeight={'semibold'}>
        Subscriptions are automatically renewed through the payment method that
        the User chose during purchase.
      </Text>
      <Text fontWeight={'semibold'}>
        The renewed subscription will last for a period equal to the original
        term.
      </Text>
      <Text>
        The User shall receive a reminder of the upcoming renewal with
        reasonable advance, outlining the procedure to be followed in order to
        cancel the automatic renewal.
      </Text>
      <Text fontWeight={'semibold'}>Termination</Text>
      <Text fontWeight={'semibold'}>
        Subscriptions may be terminated by sending a clear and unambiguous
        termination notice to the Owner using the contact details provided in
        this document, or — if applicable — by using the corresponding controls
        inside this Application.
      </Text>
      <Text fontWeight={'semibold'}>
        If the notice of termination is received by the Owner before the
        subscription renews, the termination shall take effect as soon as the
        current period is completed.
      </Text>
      <Text fontWeight={'semibold'}>
        Exception for Consumers based in Germany
      </Text>
      <Text>
        However, regardless of the above, if the User is based in Germany and
        qualifies as a Consumer, the following applies:
      </Text>
      <Text fontWeight={'semibold'}>
        At the end of the initial term, subscriptions are automatically extended
        for an unlimited period, unless the User terminates before the end of
        such term.
      </Text>
      <Text fontWeight={'semibold'}>
        The fee due upon extension will be charged on the payment method that
        the User chose during purchase. After extension, the subscription will
        last for an indefinite period and may be terminated monthly.
      </Text>
      <Text>
        The User shall receive a reminder of the upcoming unlimited extension
        with reasonable advance, outlining the procedure to be followed in order
        to prevent the extension or terminate the subscription thereafter.
      </Text>
      <Text fontWeight={'semibold'}>Termination</Text>
      <Text fontWeight={'semibold'}>
        Extended subscriptions may be terminated at any time by sending a clear
        and unambiguous termination notice to the Owner using the contact
        details provided in this document, or — if applicable — by using the
        corresponding controls inside this Application.
      </Text>
      <Text fontWeight={'semibold'}>
        If the notice of termination is received by the Owner by the end of the
        current month, the subscription shall expire at the end of such month.
      </Text>
      <Heading as="h3" fontSize="lg" fontWeight="bold" mb={4}>
        User rights
      </Heading>
      <Text fontSize="md" fontWeight="semibold" mb={2}>
        Right of withdrawal
      </Text>
      <Text>
        Unless exceptions apply, the User may be eligible to withdraw from the
        contract within the period specified below (generally 14 days), for any
        reason and without justification. Users can learn more about the
        withdrawal conditions within this section.
      </Text>
      <Text fontWeight={'semibold'}>
        Who the right of withdrawal applies to
      </Text>
      <Text>
        Unless any applicable exception is mentioned below, Users who are
        European Consumers are granted a statutory withdrawal right under EU
        rules, to withdraw from contracts entered into online (distance
        contracts) within the specified period applicable to their case, for any
        reason and without justification.
      </Text>
      <Text>
        Users that do not fit this qualification, cannot benefit from the rights
        described in this section.
      </Text>
      <Text fontWeight={'semibold'}>Exercising the right of withdrawal</Text>
      <Text>
        To exercise their right of withdrawal, Users must send to the Owner an
        unequivocal statement of their intention to withdraw from the contract.
      </Text>
      <Text>
        To this end, Users may use the model withdrawal form available from
        within the “definitions” section of this document. Users are, however,
        free to express their intention to withdraw from the contract by making
        an unequivocal statement in any other suitable way. In order to meet the
        deadline within which they can exercise such right, Users must send the
        withdrawal notice before the withdrawal period expires.
      </Text>
      <Text>When does the withdrawal period expire?</Text>
      <UnorderedList mb={4}>
        <ListItem>
          <strong>
            In case of purchase of a digital content not supplied in a tangible
            medium,
          </strong>
          the withdrawal period expires 14 days after the day that the contract
          is entered into, unless the User has waived the withdrawal right.
        </ListItem>
      </UnorderedList>
      <Text fontWeight="semibold" mb={2}>
        Effects of withdrawal
      </Text>
      <Text mb={2}>
        Users who correctly withdraw from a contract will be reimbursed by the
        Owner for all payments made to the Owner, including, if any, those
        covering the costs of delivery.
      </Text>
      <Text mb={2}>
        However, any additional costs resulting from the choice of a particular
        delivery method other than the least expensive type of standard delivery
        offered by the Owner, will not be reimbursed.
      </Text>
      <Text mb={2}>
        Such reimbursement shall be made without undue delay and, in any event,
        no later than 14 days from the day on which the Owner is informed of the
        User’s decision to withdraw from the contract. Unless otherwise agreed
        with the User, reimbursements will be made using the same means of
        payment as used to process the initial transaction. In any event, the
        User shall not incur any costs or fees as a result of such
        reimbursement.
      </Text>
      <Box mt={8}>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          UK User Rights
        </Text>
        <Box>
          <Text fontWeight="semibold" mb={2}>
            Right to Cancel
          </Text>
          <Text mb={4}>
            Unless exceptions apply, Users who are Consumers in the United
            Kingdom have a legal right of cancellation under UK law and may be
            eligible to withdraw from contracts made online (distance contracts)
            within the period specified below (generally 14 days), for any
            reason and without justification.
          </Text>
          <Text mb={4}>
            Users that do not qualify as Consumers cannot benefit from the
            rights described in this section. Users can learn more about the
            cancellation conditions within this section.
          </Text>
          <Text fontWeight="semibold" mb={2}>
            Exercising the Right to Cancel
          </Text>

          <Text mb={4}>
            To exercise their right to cancel, Users must send to the Owner an
            unequivocal statement of their intention to withdraw from the
            contract. To this end, Users may use the model withdrawal form
            available from within the “definitions” section of this document.
            Users are, however, free to express their intention to withdraw from
            the contract by making an unequivocal statement in any other
            suitable way. In order to meet the deadline within which they can
            exercise such right, Users must send the withdrawal notice before
            the cancellation period expires.
          </Text>
          <UnorderedList mb={4}>
            <ListItem>
              <strong>When does the cancellation period expire?</strong> In case
              of purchase of a digital content not supplied in a tangible
              medium, the cancellation period expires 14 days after the day that
              the contract is entered into, unless the User has waived the right
              to cancel.
            </ListItem>
          </UnorderedList>

          <Text fontWeight="semibold" mb={2}>
            Effects of Cancellation
          </Text>
          <Text>
            Users who correctly withdraw from a contract will be reimbursed by
            the Owner for all payments made to the Owner, including, if any,
            those covering the costs of delivery. However, any additional costs
            resulting from the choice of a particular delivery method other than
            the least expensive type of standard delivery offered by the Owner
            will not be reimbursed. Such reimbursement shall be made without
            undue delay and, in any event, no later than 14 days from the day on
            which the Owner is informed of the User’s decision to withdraw from
            the contract. Unless otherwise agreed with the User, reimbursements
            will be made using the same means of payment as used to process the
            initial transaction. In any event, the User shall not incur any
            costs or fees as a result of such reimbursement.
          </Text>
        </Box>
      </Box>
      {/* // Brazilian User Rights Section */}
      <Box mt={8}>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          Brazilian User Rights
        </Text>
        <Box>
          <Text fontWeight="semibold" mb={2}>
            Right of Regret
          </Text>
          <Text mb={4}>
            Unless an applicable exception is stated below, Users who are
            Consumers in Brazil have a legal right of regret under Brazilian
            law. This means that the Consumer has the right to withdraw from
            contracts made online (distance contracts or any contract signed
            away from business premises) within seven (7) days of the date the
            contract was entered into or the receipt of the product or service,
            for any reason and without justification.
          </Text>
          <Text mb={4}>
            Users that do not qualify as Consumers cannot benefit from the
            rights described in this section. The right of regret may be
            exercised by the Consumer via contact channels listed at the
            beginning of this document and in accordance with the guidelines in
            this section.
          </Text>
          <Text fontWeight="semibold" mb={2}>
            Exercising the Right of Regret
          </Text>
          <Text mb={4}>
            To exercise their right of regret, Users must send to the Owner an
            unequivocal statement of their intention to withdraw from the
            contract. To this end, Users may use the model withdrawal form
            available from within the “definitions” section of this document.
            Users are, however, free to express their intention to withdraw from
            the contract by making an unequivocal statement in any other
            suitable way. In order to meet the deadline within which they can
            exercise such right, Users must send the regret notice before the
            regret period expires. When does the regret period expire?
          </Text>
          <UnorderedList mb={4}>
            <ListItem>
              <strong>Regarding the purchase of goods,</strong> the regret
              period expires seven (7) days after the day on which the User or a
              third party designated by the User – other than the carrier –
              receives the goods.
            </ListItem>
            <ListItem>
              {' '}
              <strong>
                Regarding the purchase of several goods ordered together
              </strong>{' '}
              but delivered separately, or in case of the purchase of a single
              good consisting of multiple lots or pieces delivered separately,
              the regret period expires seven (7) days after the day on which
              the User or a third party designated by the User – other than the
              carrier receives the last good, lot or piece.
            </ListItem>
          </UnorderedList>

          <Text fontWeight="semibold" mb={2}>
            Effects of Regret
          </Text>
          <Text>
            Users who correctly withdraw from a contract will be reimbursed by
            the Owner for all payments made to the Owner, including, if any,
            those covering the costs of delivery. However, any additional costs
            resulting from the choice of a particular delivery method other than
            the least expensive type of standard delivery offered by the Owner
            will not be reimbursed. Such reimbursement shall be made without
            undue delay and, in any event, no later than 14 days from the day on
            which the Owner is informed of the User’s decision to withdraw from
            the contract or the actual return of the product, whichever occurs
            later. Unless otherwise agreed with the User, reimbursements will be
            made using the same means of payment as used to process the initial
            transaction. In any event, the User shall not incur any costs or
            fees as a result of such reimbursement.
          </Text>
          <Text fontWeight={'semibold'} my={2}>
            On the Purchase of Physical Goods:
          </Text>
          <Text mb={4}>
            Unless the Owner has offered to collect the goods, Users shall send
            back the goods or hand them over to the Owner, or to a person
            authorized by the latter to receive the goods, without undue delay
            and in any event within 14 days from the day on which they
            communicated their decision to withdraw from the contract. The
            deadline is met if the goods are handed to the carrier, or otherwise
            returned as indicated above, before the expiration of the 14-day
            period for returning the goods. The reimbursement may be withheld
            until receipt of the goods, or until Users have supplied evidence of
            having returned the goods, whichever is the earliest. Users shall
            only be liable for any diminished value of the goods resulting from
            the handling of the goods outside of that which is necessary to
            establish their nature, characteristics and functioning. The costs
            of returning the goods are borne by the Owner.
          </Text>
        </Box>
      </Box>
      <Box mt={8}>
        <Heading as="h3" fontSize="lg" fontWeight="bold" mb={4}>
          Guarantees
        </Heading>
        {/* Legal guarantee of conformity for Digital Products under EU law */}
        <Box>
          <Text fontSize="md" fontWeight="semibold" mb={2}>
            Legal guarantee of conformity for Digital Products under EU law
          </Text>
          <Text mb={4}>
            Under EU law, for a minimum period of 2 years from delivery or, in
            case of Digital Products supplied continuously for more than 2 years
            for the entire supply period, traders guarantee conformity of the
            Digital Products they provide to Consumers. Where Users qualify as
            European Consumers, the legal guarantee of conformity applies to the
            Digital Products available on this Application in accordance with
            the laws of the country of their habitual residence. National laws
            of such country may grant Users broader rights.
          </Text>
          <Text fontWeight="semibold" mb={2}>
            Forfeiture of conformity claims with regard to Digital Products
          </Text>
          <Text>
            Where the Owner provides one or more updates to the Digital Product
            purchased, the User is required to install and/or implement all such
            updates according to the instructions provided by the Owner whenever
            informed to do so. Failure to install or apply any such updates may
            result in forfeiture of conformity claims with respect to the
            Digital Product.
          </Text>
        </Box>

        {/* Legal guarantee of conformity for services for Consumers in Brazil */}
        <Box mt={8}>
          <Text fontSize="md" fontWeight="semibold" mb={2}>
            Legal guarantee of conformity for services for Consumers in Brazil
          </Text>
          <Text mb={4}>
            The legal guarantee applicable to services sold by this Application
            complies with the following terms, according to the Consumer
            Protection Code:
          </Text>
          <UnorderedList mb={4}>
            <ListItem>
              non-durable services shall have a thirty-day (30 day) guarantee;
              and
            </ListItem>
            <ListItem>
              durable services shall have a ninety-day (90 day) guarantee.
            </ListItem>
          </UnorderedList>

          <Text mb={4}>
            The warranty period starts from the end of the performance of
            services.
          </Text>
          <Text mb={4}>
            The warranty is not applicable in cases of service misuse, natural
            events, or if it has been subjected to any maintenance other than
            that provided by this Application. The warranty may be claimed
            through the contact channels provided by this Application. If
            applicable, the Owner shall bear the costs of shipping any goods for
            technical assessment. The Owner, at its own discretion, may also
            offer a contractual warranty in addition to the legal warranty. The
            regulations applicable to contractual warranties can be found in the
            specifications provided by this Application. If no such information
            is provided, only the statutory provisions shall apply.
          </Text>
        </Box>

        {/* Liability and Indemnification for EU Users */}
        <Box>
          <Heading as="h3" fontSize="lg" fontWeight="bold" mb={4}>
            Liability and Indemnification
          </Heading>
          <Text mb={4}>
            Unless otherwise explicitly stated or agreed with Users, the Owner’s
            liability for damages in connection with the execution of the
            Agreement shall be excluded, limited and/or reduced to the maximum
            extent permitted by applicable law.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mb={2}>
            EU Users
          </Text>
          <Text mb={4} fontWeight="semibold">
            Indemnification
          </Text>
          <Text mb={4}>
            The User agrees to indemnify and hold the Owner and its
            subsidiaries, affiliates, officers, directors, agents, co-branders,
            partners, and employees harmless from and against any claim or
            demand, including but not limited to lawyer's fees and costs, made
            by any third party due to or in relation to any culpable violation
            of these Terms, third-party rights, or statutory provisions
            connected to the use of the Service by the User or its affiliates,
            officers, directors, agents, co-branders, partners, and employees to
            the extent allowed by applicable law. This also applies to any
            claims exercised by third parties against the Owner related to
            Digital Products provided by the User, such as conformity claims.
          </Text>
          <Text mb={4} fontWeight="semibold">
            Limitation of Liability for User Activities on this Application
          </Text>
          <Text mb={4}>
            Users acknowledge and accept that the Owner merely provides Users
            with the technical infrastructure and features incorporated in this
            Application. The Owner does not intermediate, moderate, promote, or
            intervene in interactions, agreements, or transactions between Users
            and therefore bears no liability for any such interactions among
            Users, including the performance of any Users' obligations.
          </Text>
          <Text mb={4} fontWeight="semibold">
            Limitation of Liability:
          </Text>
          <Text mb={4}>
            Unless otherwise explicitly stated and without prejudice to
            applicable law, Users shall have no right to claim damages against
            the Owner (or any natural or legal person acting on its behalf).
            This does not apply to damages to life, health, or physical
            integrity, damages resulting from the breach of material contractual
            obligations, and/or damages resulting from intent or gross
            negligence, as long as this Application has been appropriately and
            correctly used by the User.
          </Text>
          <Text mb={4}>
            Unless damages have been caused by intent or gross negligence, or
            they affect life, health, or physical integrity, the Owner shall
            only be liable to the extent of typical and foreseeable damages at
            the moment the contract was entered into.
          </Text>
        </Box>

        {/* Liability and Indemnification for Australian Users */}
        <Box mt={8}>
          <Text fontSize="md" fontWeight="semibold" mb={2}>
            Australian Users
          </Text>
          <Text mb={4} fontWeight="semibold">
            Limitation of Liability:
          </Text>

          <Text mb={4}>
            Nothing in these Terms excludes, restricts, or modifies any
            guarantee, condition, warranty, right, or remedy which the User may
            have under the Competition and Consumer Act 2010 (Cth) or any
            similar State and Territory legislation and which cannot be
            excluded, restricted, or modified. To the fullest extent permitted
            by law, our liability to the User, including liability for a breach
            of a non-excludable right and liability which is not otherwise
            excluded under these Terms of Use, is limited, at the Owner’s sole
            discretion, to the re-performance of the services or the payment of
            the cost of having the services supplied again.
          </Text>
        </Box>

        {/* Liability and Indemnification for US Users */}
        <Box mt={8} fontWeight="semibold">
          <Text fontSize="md" mb={2}>
            US Users
          </Text>
          <Text mb={4}>Disclaimer of Warranties</Text>

          <Text mb={4}>
            This Application is provided strictly on an “as is” and “as
            available” basis. Use of the Service is at Users’ own risk. To the
            maximum extent permitted by applicable law, the Owner expressly
            disclaims all conditions, representations, and warranties, whether
            express, implied, statutory, or otherwise. No advice or information
            obtained by the User from the Owner or through the Service will
            create any warranty not expressly stated herein.
          </Text>
          <Text mb={4}> Limitation of Liability</Text>

          <Text mb={4}>
            To the maximum extent permitted by applicable law, in no event shall
            the Owner, and its subsidiaries, affiliates, officers, directors,
            agents, co-branders, partners, suppliers, and employees be liable
            for any indirect, punitive, incidental, special, consequential, or
            exemplary damages, including without limitation damages for loss of
            profits, goodwill, use, data, or other intangible losses, arising
            out of or relating to the use of, or inability to use, the Service.
          </Text>

          <UnorderedList mb={4}>
            <ListItem>
              any damage, loss or injury resulting from hacking, tampering or
              other unauthorized access or use of the Service or User account or
              the information contained therein;
            </ListItem>
            <ListItem>
              any errors, mistakes, or inaccuracies of content;
            </ListItem>
            <ListItem>
              personal injury or property damage, of any nature whatsoever,
              resulting from User access to or use of the Service;
            </ListItem>
            <ListItem>
              any unauthorized access to or use of the Owner’s secure servers
              and/or any personal information stored therein;
            </ListItem>
            <ListItem>
              any interruption or cessation of transmission to or from the
              Service;
            </ListItem>
            <ListItem>
              any bugs, viruses, trojan horses, or the like that may be
              transmitted to or through the Service;
            </ListItem>
            <ListItem>
              any errors or omissions in any content or for any loss or damage
              incurred as a result of the use of any content posted, emailed,
              transmitted, or otherwise made available through the Service;
              and/or
            </ListItem>
            <ListItem>
              the defamatory, offensive, or illegal conduct of any User or third
              party.
            </ListItem>
          </UnorderedList>

          <Text mb={4}>
            In no event shall the Owner, and its subsidiaries, affiliates,
            officers, directors, agents, co-branders, partners, suppliers, and
            employees be liable for any claims, proceedings, liabilities,
            obligations, damages, losses, or costs in an amount exceeding the
            amount paid by User to the Owner hereunder in the preceding 12
            months, or the period of duration of this agreement between the
            Owner and User, whichever is shorter.
          </Text>

          <Text mb={4}>
            This limitation of liability section shall apply to the fullest
            extent permitted by law in the applicable jurisdiction whether the
            alleged liability is based on contract, tort, negligence, strict
            liability, or any other basis, even if the User has been advised of
            the possibility of such damage.
          </Text>

          <Text mb={4}>
            Some jurisdictions do not allow the exclusion or limitation of
            incidental or consequential damages, therefore the above limitations
            or exclusions may not apply to the User. The terms give User
            specific legal rights, and User may also have other rights which
            vary from jurisdiction to jurisdiction. The disclaimers, exclusions,
            and limitations of liability under the terms shall not apply to the
            extent prohibited by applicable law.
          </Text>
        </Box>
      </Box>
      <Box fontWeight={'semibold'}>
        <Text mb={4}>Indemnification</Text>
        <Text mb={4}>
          The User agrees to defend, indemnify and hold the Owner and its
          subsidiaries, affiliates, officers, directors, agents, co-branders,
          partners, suppliers and employees harmless from and against any and
          all claims or demands, damages, obligations, losses, liabilities,
          costs or debt, and expenses, including, but not limited to, legal fees
          and expenses, arising from:
        </Text>

        <UnorderedList mb={4}>
          <ListItem>
            User’s use of and access to the Service, including any data or
            content transmitted or received by User;
          </ListItem>
          <ListItem>
            User’s violation of these terms, including, but not limited to,
            User’s breach of any of the representations and warranties set forth
            in these terms;
          </ListItem>
          <ListItem>
            User’s violation of any third-party rights, including, but not
            limited to, any right of privacy or intellectual property rights;
          </ListItem>
          <ListItem>
            User’s violation of any statutory law, rule, or regulation;
          </ListItem>
          <ListItem>
            any content that is submitted from User’s account, including third
            party access with User’s unique username, password or other security
            measure, if applicable, including, but not limited to, misleading,
            false, or inaccurate information;
          </ListItem>
          <ListItem>User’s wilful misconduct; or</ListItem>
          <ListItem>
            statutory provision by User or its affiliates, officers, directors,
            agents, co-branders, partners, suppliers, and employees to the
            extent allowed by applicable law.
          </ListItem>
        </UnorderedList>
      </Box>
      {/* Common provisions */}
      <Box mt={8}>
        <Heading as="h3" fontSize="lg" fontWeight="bold" mb={4}>
          Common Provisions
        </Heading>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          No Waiver
        </Text>
        <Text mb={4}>
          The Owner’s failure to assert any right or provision under these Terms
          shall not constitute a waiver of any such right or provision. No
          waiver shall be considered a further or continuing waiver of such term
          or any other term.
        </Text>
        <Text mb={4}>
          Service Interruption: To ensure the best possible service level, the
          Owner reserves the right to interrupt the Service for maintenance,
          system updates or any other changes, informing the Users
          appropriately. Within the limits of law, the Owner may also decide to
          suspend or discontinue the Service altogether. If the Service is
          discontinued, the Owner will cooperate with Users to enable them to
          withdraw Personal Data or information and will respect Users' rights
          relating to continued product use and/or compensation, as provided for
          by applicable law. Additionally, the Service might not be available
          due to reasons outside the Owner’s reasonable control, such as “force
          majeure” events (infrastructural breakdowns or blackouts etc.).
        </Text>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          Service Reselling
        </Text>
        <Text mb={4}>
          Users may not reproduce, duplicate, copy, sell, resell or exploit any
          portion of this Application and of its Service without the Owner’s
          express prior written permission, granted either directly or through a
          legitimate reselling programme.
        </Text>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          Privacy Policy
        </Text>
        <Text mb={4}>
          To learn more about the use of their Personal Data, Users may refer to
          the privacy policy of this Application.
        </Text>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          Intellectual Property Rights
        </Text>
        <Text mb={4}>
          Without prejudice to any more specific provision of these Terms, any
          intellectual property rights, such as copyrights, trademark rights,
          patent rights and design rights related to this Application are the
          exclusive property of the Owner or its licensors and are subject to
          the protection granted by applicable laws or international treaties
          relating to intellectual property. All trademarks — nominal or
          figurative — and all other marks, trade names, service marks, word
          marks, illustrations, images, or logos appearing in connection with
          this Application are, and remain, the exclusive property of the Owner
          or its licensors and are subject to the protection granted by
          applicable laws or international treaties related to intellectual
          property.
        </Text>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          Changes to these Terms
        </Text>
        <Text mb={4}>
          The Owner reserves the right to amend or otherwise modify these Terms
          at any time. In such cases, the Owner will appropriately inform the
          User of these changes.
        </Text>
        <Text mb={4}>
          Such changes will only affect the relationship with the User from the
          date communicated to Users onwards.
        </Text>
        <strong>
          The continued use of the Service will signify the User’s acceptance of
          the revised Terms.
        </strong>{' '}
        <Text>
          If Users do not wish to be bound by the changes, they must stop using
          the Service and may terminate the Agreement. The applicable previous
          version will govern the relationship prior to the User's acceptance.
          The User can obtain any previous version from the Owner. If legally
          required, the Owner will notify Users in advance of when the modified
          Terms will take effect.
        </Text>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          Assignment of Contract
        </Text>
        <Text mb={4}>
          The Owner reserves the right to transfer, assign, dispose of by
          novation, or subcontract any or all rights or obligations under these
          Terms, taking the User’s legitimate interests into account. Provisions
          regarding changes of these Terms will apply accordingly. Users may not
          assign or transfer their rights or obligations under these Terms in
          any way, without the written permission of the Owner.
        </Text>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          Contacts
        </Text>
        <Text mb={4}>
          All communications relating to the use of this Application must be
          sent using the contact information stated in this document.
        </Text>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          Severability
        </Text>
        <Text mb={4}>
          Should any provision of these Terms be deemed or become invalid or
          unenforceable under applicable law, the invalidity or unenforceability
          of such provision shall not affect the validity of the remaining
          provisions, which shall remain in full force and effect.
        </Text>
        <Text fontSize="14px" fontWeight="semibold" mt={2}>
          EU Users
        </Text>
        <Text mb={4}>
          Should any provision of these Terms be or be deemed void, invalid or
          unenforceable, the parties shall do their best to find, in an amicable
          way, an agreement on valid and enforceable provisions thereby
          substituting the void, invalid or unenforceable parts. In case of
          failure to do so, the void, invalid or unenforceable provisions shall
          be replaced by the applicable statutory provisions, if so permitted or
          stated under the applicable law. Without prejudice to the above, the
          nullity, invalidity or impossibility to enforce a particular provision
          of these Terms shall not nullify the entire Agreement, unless the
          severed provisions are essential to the Agreement, or of such
          importance that the parties would not have entered into the contract
          if they had known that the provision would not be valid, or in cases
          where the remaining provisions would translate into an unacceptable
          hardship on any of the parties.
        </Text>
        <Text fontSize="14px" fontWeight="semibold" mt={2}>
          US Users
        </Text>
        <Text mb={4}>
          Any such invalid or unenforceable provision will be interpreted,
          construed and reformed to the extent reasonably required to render it
          valid, enforceable and consistent with its original intent. These
          Terms constitute the entire Agreement between Users and the Owner with
          respect to the subject matter hereof, and supersede all other
          communications, including but not limited to all prior agreements,
          between the parties with respect to such subject matter. These Terms
          will be enforced to the fullest extent permitted by law.
        </Text>
      </Box>
      <Box mt={8}>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          Governing Law
        </Text>
        <Text mb={4}>
          These Terms are governed by the law of the place where the Owner is
          based, as disclosed in the relevant section of this document, without
          regard to conflict of laws principles.
        </Text>
        <Text fontSize="13px" fontWeight="semibold" mt={2}>
          Prevalence of national law
        </Text>
        <Text>
          However, regardless of the above, if the law of the country that the
          User is located in provides for higher applicable consumer protection
          standards, such higher standards shall prevail.
        </Text>
        <Text fontSize="13px" fontWeight="semibold" mt={2}>
          Exception for Consumers in Switzerland
        </Text>
        <Text>
          If the User qualifies as a Consumer in Switzerland, Swiss law will
          apply.
        </Text>{' '}
        <Text fontSize="13px" fontWeight="semibold" mt={2}>
          Exception for Consumers in Brazil
        </Text>
        <Text>
          If the User qualifies as a Consumer in Brazil and the product and/or
          service is commercialized in Brazil, Brazilian law will apply.{' '}
        </Text>
      </Box>
      {/* Venue of Jurisdiction */}
      <Box mt={8}>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          Venue of Jurisdiction
        </Text>
        <Text mb={4}>
          The exclusive competence to decide on any controversy resulting from
          or connected to these Terms lies with the courts of the place where
          the Owner is based, as displayed in the relevant section of this
          document.
        </Text>
        <Text fontSize="13px" fontWeight="semibold" mb={2}>
          Exception for Consumers in Europe{' '}
        </Text>
        <Text>
          The above does not apply to any Users that qualify as European
          Consumers, nor to Consumers based in the United Kingdom, Switzerland,
          Norway or Iceland.
        </Text>{' '}
        <Text fontSize="13px" fontWeight="semibold" mt={2}>
          Exception for Consumers in Brazil
        </Text>
        <Text>
          The above does not apply to Users in Brazil that qualify as Consumers.
        </Text>
      </Box>
      {/* Dispute Resolution */}
      <Box mt={8}>
        <Heading as="h3" fontSize="lg" fontWeight="bold" mb={4}>
          Dispute Resolution
        </Heading>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          Amicable Dispute Resolution
        </Text>
        <Text mb={4}>
          Users may bring any disputes to the Owner who will try to resolve them
          amicably. While Users' right to take legal action shall always remain
          unaffected, in the event of any controversy regarding the use of this
          Application or the Service, Users are kindly asked to contact the
          Owner at the contact details provided in this document. The User may
          submit the complaint including a brief description and if applicable,
          the details of the related order, purchase, or account, to the Owner’s
          email address specified in this document. The Owner will process the
          complaint without undue delay and within 2 days of receiving it.
        </Text>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          Online Dispute Resolution for Consumers
        </Text>
        <Text mb={4}>
          The European Commission has established an online platform for
          alternative dispute resolutions that facilitates an out-of-court
          method for solving disputes related to and stemming from online sale
          and service contracts. As a result, any European Consumer or Consumer
          based in Norway, Iceland, or Liechtenstein can use such platform for
          resolving disputes stemming from contracts which have been entered
          into online. The platform is available at the following link:{' '}
          <a href="https://ec.europa.eu/consumers/odr">
            Online Dispute Resolution Platform
          </a>
          .
        </Text>
      </Box>
    </Box>
  );
}

export default TandC;
