// Copyright 2023 Zinc Labs Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import http from "./http";

const settings = {
  createLogo: (org_identifier: string, formData: any) => {
    const url: string = `/api/${org_identifier}/settings/upload-logo`;
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    return http(headers).post(url, formData);
  },
  deleteLogo: (
    org_identifier: string,
    stream_name: string,
    stream_type: string
  ) => {
    return http().delete(
      `/api/${org_identifier}/streams/${stream_name}?type=${stream_type}`
    );
  },
};

export default settings;
