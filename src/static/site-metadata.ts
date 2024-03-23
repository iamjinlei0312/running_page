interface ISiteMetadataResult {
  siteTitle: string;
  siteUrl: string;
  description: string;
  logo: string;
  navLinks: {
    name: string;
    url: string;
  }[];
}

const data: ISiteMetadataResult = {
  siteTitle: 'Running Page',
  siteUrl: 'https://jinlei.run',
  logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTtc69JxHNcmN1ETpMUX4dozAgAN6iPjWalQ&usqp=CAU',
  description: 'Personal site and blog',
  navLinks: [
    {
      name: 'Douyin',
      url: 'https://www.douyin.com/user/self?modal_id=7334546040516840730&showTab=post',
    },
    {
      name: 'About',
      url: 'https://github.com/iamjinlei0312/running_page/blob/master/README.md',
    },
  ],
};

export default data;
