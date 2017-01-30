/**
 * Client tests
 */
/* global sinon */
/*eslint-disable max-nested-callbacks */
/* eslint no-unused-expressions: 0 */

import React from "react";
import { curry, get, map } from "lodash";
import { mount } from "enzyme";
import VictorySharedEvents from "src/victory-shared-events/victory-shared-events";
import { VictoryPie } from "victory-pie";
import { VictoryBar, VictoryScatter } from "victory-chart";
import { Slice, Bar, Point } from "src/victory-primitives";

describe("components/victory-shared-events", () => {
  it.only("should trigger shared events on selected children", () => {
    const data = [
      {x: "a", y: 2},
      {x: "b", y: 3},
      {x: "c", y: 5},
      {x: "d", y: 4}
    ];
    const wrapper = mount(
      <svg>
        <VictorySharedEvents
          events={[{
            childName: ["pie", "bar"],
            target: "data",
            eventHandlers: {
              onClick: () => {
                return [{
                  childName: ["pie", "bar"],
                  mutation: (props) => {
                    return {
                      style: Object.assign({}, props.style, {fill: "tomato"})
                    };
                  }
                }];
              }
            }
          }]}
        >
          <VictoryBar name="bar"
            data={data}
            dataComponent= {< Bar />}
          />
          <VictoryPie name="pie"
            data={data}
            dataComponent={< Slice />}
          />
          <VictoryScatter name="scatter"
            data={data}
            dataComponent={< Point />}
          />
        </VictorySharedEvents>
      </svg>
    );

    const findDataComponent = (type, xName, wrapper) => {
      return wrapper.find(type).filterWhere((dataComponent) => {
        return get(dataComponent.props(), "datum.xName") === xName;
      });
    };

    const findDataComponentsByXName = (xName, wrapper) => {
      return map([Slice, Bar, Point], (type) => {
        return findDataComponent(type, xName, wrapper);
      });
    };

    const [sliceA, barA, pointA] = findDataComponentsByXName("a", wrapper);
    const [sliceB, barB, pointB] = findDataComponentsByXName("b", wrapper);
    const [sliceC, barC, pointC] = findDataComponentsByXName("c", wrapper);

    expect(sliceA.props().style.fill).not.to.eql('tomato');
    expect(barA.props().style.fill).not.to.eql('tomato');
    expect(pointA.props().style.fill).not.to.eql('tomato');
    sliceA.simulate("click");
    expect(sliceA.props().style.fill).to.eql('tomato');
    expect(barA.props().style.fill).to.eql('tomato');
    expect(pointA.props().style.fill).not.to.eql('tomato');

    expect(sliceB.props().style.fill).not.to.eql('tomato');
    expect(barB.props().style.fill).not.to.eql('tomato');
    expect(pointB.props().style.fill).not.to.eql('tomato');
    barB.simulate("click");
    expect(sliceB.props().style.fill).to.eql('tomato');
    expect(barB.props().style.fill).to.eql('tomato');
    expect(pointB.props().style.fill).not.to.eql('tomato');

    expect(sliceC.props().style.fill).not.to.eql('tomato');
    expect(barC.props().style.fill).not.to.eql('tomato');
    expect(pointC.props().style.fill).not.to.eql('tomato');
    pointC.simulate("click");
    expect(sliceC.props().style.fill).not.to.eql('tomato');
    expect(barC.props().style.fill).not.to.eql('tomato');
    expect(pointC.props().style.fill).not.to.eql('tomato');
  });
});